import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { STRIPE_PRICE_IDS } from '@/lib/founding';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();

    const priceId = STRIPE_PRICE_IDS[planId];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Get the current logged-in user so we can link them to the Stripe session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Derive origin for redirect URLs (works on Vercel + localhost)
    const origin =
      request.headers.get('origin') ||
      request.headers.get('x-forwarded-proto') + '://' + request.headers.get('x-forwarded-host') ||
      'http://localhost:3000';

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      // Pass user identity so the webhook can update the right profile
      ...(user?.email ? { customer_email: user.email } : {}),
      metadata: {
        supabase_user_id: user?.id ?? '',
        plan_id: planId,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          supabase_user_id: user?.id ?? '',
          plan_id: planId,
          is_founding: 'true',
        },
      },
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
