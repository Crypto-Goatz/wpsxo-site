import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { provisionTrialAccount } from '@/lib/crm/provision';
import { supabaseAdmin } from '@/lib/supabase';
import { createLicenseForPurchase } from '@/lib/license';
import {
  grantCredits,
  setPlan,
  grantAddon,
  getProfileByEmail,
  SUBSCRIPTION_PLANS,
} from '@/lib/credits';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  if (!sig) {
    return Response.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('[webhook] Invalid signature:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        // Subscriptions arrive separately via customer.subscription.created.
        // Only act here for one-time payments (lifetime + credit packs).
        if (session.mode !== 'payment') {
          return Response.json({ received: true, action: 'skipped_not_payment' })
        }

        const productType = session.metadata?.product_type || 'lifetime'
        const email =
          session.customer_details?.email || session.customer_email || ''

        // ── Credit pack flow ──────────────────────────────────────
        if (productType === 'credit_pack') {
          const credits = parseInt(session.metadata?.credits || '0', 10)
          if (!credits) {
            return Response.json({ received: true, action: 'skipped_no_credits' })
          }

          // Idempotency
          const { data: existing } = await supabaseAdmin
            .from('credit_transactions')
            .select('id')
            .eq('ref_type', 'stripe_checkout')
            .eq('ref_id', session.id)
            .maybeSingle()
          if (existing) {
            return Response.json({ received: true, action: 'skipped_duplicate_credit_pack' })
          }

          // Resolve user_id (metadata first, fall back to email lookup)
          let userId = session.metadata?.user_id || ''
          if (!userId && email) {
            const profile = await getProfileByEmail(email)
            if (profile) userId = profile.id
          }
          if (!userId) {
            console.error('[webhook] credit_pack purchase but no user_id resolvable for', email)
            return Response.json({ received: true, action: 'no_user_id' })
          }

          const newBalance = await grantCredits({
            userId,
            amount: credits,
            reason: 'credit_pack_purchase',
            refType: 'stripe_checkout',
            refId: session.id,
          })

          console.log(
            `[webhook] +${credits} credits for ${email} (balance=${newBalance})`,
          )
          return Response.json({ received: true, action: 'credits_granted', balance: newBalance })
        }

        // ── Lifetime purchase flow (existing) ─────────────────────
        const productSlug = session.metadata?.product || ''
        const priceId = session.metadata?.price_id || ''
        const name = session.customer_details?.name || ''
        const amountTotal = (session.amount_total ?? 0) / 100

        console.log(
          `[webhook] lifetime purchase — ${email} bought ${productSlug} ($${amountTotal}) price=${priceId}`,
        )

        // Idempotent: if already logged, skip
        const { data: existing } = await supabaseAdmin
          .from('lifetime_purchases')
          .select('id')
          .eq('stripe_session_id', session.id)
          .maybeSingle()
        if (existing) {
          return Response.json({ received: true, action: 'skipped_duplicate' })
        }

        const { data: purchase, error: purchaseErr } = await supabaseAdmin
          .from('lifetime_purchases')
          .insert({
            stripe_session_id: session.id,
            stripe_customer_id: (session.customer as string) || null,
            stripe_payment_intent_id: (session.payment_intent as string) || null,
            email,
            name,
            product_slug: productSlug,
            price_id: priceId,
            amount_total_cents: session.amount_total ?? 0,
            currency: session.currency || 'usd',
            status: 'paid',
            metadata: session.metadata as Record<string, string> | null,
          })
          .select('id')
          .single()

        if (purchaseErr) {
          console.error('[webhook] insert lifetime_purchases failed:', purchaseErr)
          break
        }

        // Mint a real license key for this purchase.
        try {
          const license = await createLicenseForPurchase({
            email,
            productSlug,
            purchaseId: purchase.id as string,
            priceId,
            metadata: {
              stripe_session_id: session.id,
              amount_total_cents: session.amount_total ?? 0,
              promo_code:
                (session.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code as
                  | string
                  | undefined) || null,
            },
          })
          console.log(
            `[webhook] minted ${license.key} for ${email} → ${productSlug}`,
          )
        } catch (e) {
          console.error('[webhook] license mint failed:', (e as Error).message)
        }

        // Also grant the addon on the user's profile so dashboard reflects it
        // immediately (token unlocks the addon + license is paste-ready).
        try {
          const profile = await getProfileByEmail(email)
          if (profile) {
            await grantAddon({
              userId: profile.id,
              addonSlug: productSlug,
              source: 'lifetime_purchase',
              refId: session.id,
            })
          }
        } catch (e) {
          console.error('[webhook] addon grant failed:', (e as Error).message)
        }
        break
      }

      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;

        // ── Pro/Studio plan flow ──────────────────────────────────
        // Subscriptions tagged with metadata.product_type='subscription'
        // are the new Pro/Studio plans. Flip profiles.plan + grant
        // monthly credits per the SUBSCRIPTION_PLANS map.
        if (sub.metadata?.product_type === 'subscription') {
          const plan = sub.metadata?.plan as 'pro' | 'studio' | undefined
          if (plan && SUBSCRIPTION_PLANS[plan]) {
            const customer = (await stripe.customers.retrieve(
              sub.customer as string,
            )) as Stripe.Customer
            const userId =
              sub.metadata?.user_id ||
              (customer.email
                ? (await getProfileByEmail(customer.email))?.id
                : undefined) ||
              ''
            if (userId) {
              const renewsAt = (sub as unknown as { current_period_end?: number })
                .current_period_end
              await setPlan({
                userId,
                plan,
                renewsAt: renewsAt
                  ? new Date(renewsAt * 1000).toISOString()
                  : null,
                status: sub.status,
                monthlyCredits: SUBSCRIPTION_PLANS[plan].monthly_credits,
              })
              console.log(
                `[webhook] subscription ${plan} activated for user ${userId} (${customer.email})`,
              )
            } else {
              console.error(
                '[webhook] subscription created but no user_id resolvable for',
                customer.email,
              )
            }
          }
          return Response.json({ received: true, action: 'plan_set' })
        }

        // Only provision on trial start (legacy CRM-trial path)
        if (sub.status !== 'trialing') {
          return Response.json({ received: true, action: 'skipped_not_trialing' });
        }

        // Duplicate guard
        const { data: existing } = await supabaseAdmin
          .from('trial_accounts')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single();

        if (existing) {
          console.log('[webhook] Duplicate detected, skipping');
          return Response.json({ received: true, action: 'skipped_duplicate' });
        }

        // Get customer details
        const customer = await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer;
        const priceId = sub.items.data[0]?.price?.id || '';
        const productSlug = sub.metadata?.product || customer.metadata?.product || 'wpsxo';

        // Determine plan tier from price
        let planTier: 'starter' | 'pro' | 'agency' = 'starter';
        if (priceId.includes('fSj9vz4K')) planTier = 'agency';   // $99 WP-SXO
        else if (priceId.includes('rvCWJ9R4')) planTier = 'pro';  // $49 OnPress

        await provisionTrialAccount({
          stripeCustomerId: customer.id,
          stripeSubscriptionId: sub.id,
          email: customer.email!,
          firstName: customer.metadata?.first_name || customer.name?.split(' ')[0] || '',
          lastName: customer.metadata?.last_name || customer.name?.split(' ').slice(1).join(' ') || '',
          companyName: customer.metadata?.company_name || customer.name || customer.email!,
          phone: customer.phone || customer.metadata?.phone,
          planTier,
          priceId,
          source: 'wpsxo',
        });

        console.log(`[webhook] Provisioned: ${customer.email} (${planTier})`);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;

        // Pro/Studio plan: refresh plan_renews_at + (on renewal cycle) grant new month's credits.
        if (sub.metadata?.product_type === 'subscription') {
          const plan = sub.metadata?.plan as 'pro' | 'studio' | undefined
          if (plan && SUBSCRIPTION_PLANS[plan]) {
            const customer = (await stripe.customers.retrieve(
              sub.customer as string,
            )) as Stripe.Customer
            const userId =
              sub.metadata?.user_id ||
              (customer.email
                ? (await getProfileByEmail(customer.email))?.id
                : undefined) ||
              ''
            if (userId) {
              const renewsAt = (sub as unknown as { current_period_end?: number })
                .current_period_end
              const renewIso = renewsAt ? new Date(renewsAt * 1000).toISOString() : null

              // Detect a renewal cycle by comparing the previous plan_renews_at
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('plan_renews_at')
                .eq('id', userId)
                .single()

              const isRenewalCycle =
                renewIso &&
                profile?.plan_renews_at &&
                new Date(renewIso).getTime() >
                  new Date(profile.plan_renews_at).getTime()

              await setPlan({
                userId,
                plan,
                renewsAt: renewIso,
                status: sub.status,
                monthlyCredits: isRenewalCycle
                  ? SUBSCRIPTION_PLANS[plan].monthly_credits
                  : 0,
              })
              console.log(
                `[webhook] sub ${plan} updated for ${customer.email} (renewal=${isRenewalCycle})`,
              )
            }
          }
          return Response.json({ received: true, action: 'plan_updated' })
        }

        // Legacy trial flow
        if (sub.status === 'active') {
          await supabaseAdmin
            .from('trial_accounts')
            .update({
              status: 'active',
              converted_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', sub.customer as string);

          console.log(`[webhook] Converted: ${sub.customer}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        // Pro/Studio plan: drop user back to free tier.
        if (sub.metadata?.product_type === 'subscription') {
          const customer = (await stripe.customers.retrieve(
            sub.customer as string,
          )) as Stripe.Customer
          const userId =
            sub.metadata?.user_id ||
            (customer.email
              ? (await getProfileByEmail(customer.email))?.id
              : undefined) ||
            ''
          if (userId) {
            await setPlan({
              userId,
              plan: 'free',
              renewsAt: null,
              status: 'cancelled',
              monthlyCredits: 0,
            })
            console.log(`[webhook] sub cancelled — ${customer.email} → free`)
          }
          return Response.json({ received: true, action: 'plan_cancelled' })
        }

        // Legacy trial flow
        await supabaseAdmin
          .from('trial_accounts')
          .update({ status: 'cancelled' })
          .eq('stripe_customer_id', sub.customer as string);
        console.log(`[webhook] Cancelled: ${sub.customer}`);
        break;
      }
    }
  } catch (err: any) {
    console.error('[webhook] Error:', err.message);
    return Response.json({ error: 'Processing failed' }, { status: 500 });
  }

  return Response.json({ received: true });
}
