import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const priceId = req.nextUrl.searchParams.get('price');
  const productSlug = req.nextUrl.searchParams.get('product');

  if (!priceId) {
    return Response.json({ error: 'Missing price parameter' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&product=${productSlug}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${productSlug}?checkout=cancelled`,
    metadata: {
      product: productSlug || '',
      source: 'wpsxo',
    },
    subscription_data: {
      trial_period_days: parseInt(process.env.TRIAL_DURATION_DAYS || '14'),
      metadata: {
        product: productSlug || '',
        source: 'wpsxo',
      },
    },
  });

  return Response.redirect(session.url!);
}
