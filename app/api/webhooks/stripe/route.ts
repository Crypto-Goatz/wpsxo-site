import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { provisionTrialAccount } from '@/lib/crm/provision';
import { supabaseAdmin } from '@/lib/supabase';
import { createLicenseForPurchase } from '@/lib/license';

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
        // Only act here for one-time payments (lifetime products).
        if (session.mode !== 'payment') {
          return Response.json({ received: true, action: 'skipped_not_payment' })
        }
        const productSlug = session.metadata?.product || ''
        const priceId = session.metadata?.price_id || ''
        const email =
          session.customer_details?.email || session.customer_email || ''
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
        break
      }

      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;

        // Only provision on trial start
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
        if (sub.status === 'active') {
          // Trial converted to paid
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
        await supabaseAdmin
          .from('trial_accounts')
          .update({
            status: 'cancelled',
          })
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
