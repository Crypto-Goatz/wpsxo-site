import { stripe } from '@/lib/stripe';

export async function GET() {
  // TODO: Get customer ID from session
  // For now redirect to Stripe customer portal
  const session = await stripe.billingPortal.sessions.create({
    customer: 'cus_placeholder', // Replace with actual customer from auth
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return Response.redirect(session.url);
}
