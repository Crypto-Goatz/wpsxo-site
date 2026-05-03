import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'

/**
 * Stripe Checkout entry point.
 * GET /api/checkout?price=<price_id>&product=<slug>
 *
 * Looks up the price first to decide payment vs subscription mode.
 * Subscriptions get a 30-day trial. One-time charges go to /dashboard
 * with a download token query param.
 */
export async function GET(req: NextRequest) {
  const priceId = req.nextUrl.searchParams.get('price')
  const productSlug = req.nextUrl.searchParams.get('product') || ''

  if (!priceId) {
    return Response.json({ error: 'Missing price parameter' }, { status: 400 })
  }

  // Look up the price to decide checkout mode.
  let price: import('stripe').Stripe.Price
  try {
    price = await stripe.prices.retrieve(priceId)
  } catch (e) {
    return Response.json(
      { error: `Unknown price: ${priceId}`, detail: (e as Error).message },
      { status: 400 },
    )
  }
  if (!price.active) {
    return Response.json(
      { error: `Price ${priceId} is not active.` },
      { status: 400 },
    )
  }

  const isSubscription = price.type === 'recurring'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wpsxo.com'

  const session = await stripe.checkout.sessions.create({
    mode: isSubscription ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success&product=${productSlug}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/products/${productSlug}?checkout=cancelled`,
    allow_promotion_codes: true,
    customer_creation: isSubscription ? undefined : 'always',
    metadata: {
      product: productSlug,
      source: 'wpsxo.com',
      price_id: priceId,
    },
    ...(isSubscription
      ? {
          subscription_data: {
            trial_period_days: parseInt(
              process.env.TRIAL_DURATION_DAYS || '30',
              10,
            ),
            metadata: {
              product: productSlug,
              source: 'wpsxo.com',
            },
          },
        }
      : {
          payment_intent_data: {
            metadata: {
              product: productSlug,
              source: 'wpsxo.com',
            },
          },
        }),
  })

  if (!session.url) {
    return Response.json({ error: 'Stripe did not return a URL' }, { status: 500 })
  }

  return Response.redirect(session.url, 303)
}
