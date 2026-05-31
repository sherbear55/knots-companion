import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { STRIPE_PRICE_IDS } from '@/lib/founding';

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();

    const priceId = STRIPE_PRICE_IDS[planId];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Derive origin for redirect URLs (works on Vercel + localhost)
    const origin =
      request.headers.get('origin') ||
      request.headers.get('x-forwarded-proto') + '://' + request.headers.get('x-forwarded-host') ||
      'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan_id: planId,
          is_founding: 'true',
        },
      },
      // Collect email — ties the Stripe customer to the subscriber
      customer_email: undefined, // Stripe will collect it on the checkout page
      allow_promotion_codes: false,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${origin}/checkout?plan=${planId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Stripe checkout session error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
