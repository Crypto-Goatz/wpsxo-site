/**
 * GET /api/subscribe?plan=pro|studio
 *
 * Stripe Checkout for Pro/Studio recurring subscription.
 * Webhook handles: customer.subscription.created/updated/deleted to flip
 * profiles.plan + grant monthly credits.
 */

import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { SUBSCRIPTION_PLANS, getProfileByToken } from '@/lib/credits'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get('plan') as 'pro' | 'studio' | null
  if (!plan || !SUBSCRIPTION_PLANS[plan]) {
    return Response.json({ error: 'plan must be pro or studio' }, { status: 400 })
  }

  const priceId = SUBSCRIPTION_PLANS[plan].price_id
  if (!priceId) {
    return Response.json(
      { error: `Plan ${plan} price not configured. Set STRIPE_PRICE_${plan.toUpperCase()}_MONTHLY.` },
      { status: 500 },
    )
  }

  // Resolve user via token query OR supabase session
  const tokenParam = req.nextUrl.searchParams.get('token')
  let email: string | undefined
  let userId: string | undefined

  if (tokenParam) {
    const profile = await getProfileByToken(tokenParam)
    if (profile) {
      email = profile.email
      userId = profile.id
    }
  }

  if (!email) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.email) {
      email = user.email
      userId = user.id
    }
  }

  if (!email) {
    return Response.json({ error: 'Sign in required' }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wpsxo.com'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: {
        product_type: 'subscription',
        plan,
        user_id: userId || '',
      },
    },
    metadata: {
      product_type: 'subscription',
      plan,
      user_id: userId || '',
    },
  })

  if (!session.url) {
    return Response.json({ error: 'Stripe did not return a URL' }, { status: 500 })
  }
  return Response.redirect(session.url, 303)
}
