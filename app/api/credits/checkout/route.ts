/**
 * GET /api/credits/checkout?credits=<100|500|2500|10000>
 *
 * Stripe Checkout entry for buying a credit pack. After successful payment
 * the webhook deposits credits into the user's balance.
 *
 * Auth: needs the user's email for Stripe to associate the customer. We
 * resolve via 0n_ token cookie OR a token query param OR a session cookie.
 */

import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CREDIT_PACKS, PACK_PRICE_IDS, getProfileByToken } from '@/lib/credits'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID_AMOUNTS = Object.keys(CREDIT_PACKS).map((n) => parseInt(n, 10))

export async function GET(req: NextRequest) {
  const credits = parseInt(req.nextUrl.searchParams.get('credits') || '0', 10)
  if (!VALID_AMOUNTS.includes(credits)) {
    return Response.json(
      { error: `Invalid credit pack. Choose: ${VALID_AMOUNTS.join(', ')}` },
      { status: 400 },
    )
  }

  const priceId = PACK_PRICE_IDS[credits]
  if (!priceId) {
    return Response.json(
      { error: `Pack price not configured for ${credits} credits` },
      { status: 500 },
    )
  }

  // Resolve user — token query param wins, then supabase session cookie
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
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/credits?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/credits?checkout=cancelled`,
    allow_promotion_codes: true,
    metadata: {
      product_type: 'credit_pack',
      credits: String(credits),
      user_id: userId || '',
      source: 'wpsxo.com/credits',
    },
    payment_intent_data: {
      metadata: {
        product_type: 'credit_pack',
        credits: String(credits),
        user_id: userId || '',
      },
    },
  })

  if (!session.url) {
    return Response.json({ error: 'Stripe did not return a URL' }, { status: 500 })
  }
  return Response.redirect(session.url, 303)
}
