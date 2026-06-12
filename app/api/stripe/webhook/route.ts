import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';

// Must be force-dynamic — reads raw request body
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Verify the event came from Stripe (not a spoofed request)
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('Webhook signature error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {

      // ── Checkout completed → user finished Stripe payment/trial setup ──────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get subscription to read trial end date
        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );

        const supabaseUserId = session.metadata?.supabase_user_id;
        const planId         = session.metadata?.plan_id ?? subscription.metadata?.plan_id;
        const customerId     = session.customer as string;
        const trialEndsAt    = subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null;

        const updatePayload = {
          tier:               'founding',
          is_founding:        true,
          founding_plan:      planId ?? null,
          stripe_customer_id: customerId,
          trial_ends_at:      trialEndsAt,
        };

        if (supabaseUserId) {
          // Best path — user ID is embedded in session metadata
          const { error } = await supabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', supabaseUserId);
          if (error) console.error('Profile update error (by id):', error);
        } else {
          // Fallback — look up by email via auth admin API
          const email = session.customer_details?.email ?? session.customer_email;
          if (email) {
            const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
            const match = data?.users?.find(u => u.email === email);
            if (match) {
              const { error } = await supabase
                .from('profiles')
                .update(updatePayload)
                .eq('id', match.id);
              if (error) console.error('Profile update error (by email):', error);
            } else {
              console.error('Webhook: no Supabase user found for email:', email);
            }
          }
        }
        break;
      }

      // ── Subscription updated (trial → active, plan change, etc.) ─────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // If trial ended and subscription is now active, just update trial_ends_at
        if (subscription.status === 'active') {
          await supabase
            .from('profiles')
            .update({ trial_ends_at: null })
            .eq('stripe_customer_id', customerId);
        }

        // If subscription was cancelled but hasn't ended yet, note it
        if (subscription.status === 'canceled') {
          await supabase
            .from('profiles')
            .update({ tier: 'free', is_founding: false, trial_ends_at: null })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      // ── Subscription deleted (expired, payment failed, cancelled) ─────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('profiles')
          .update({ tier: 'free', is_founding: false, trial_ends_at: null })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        // Unhandled event type — safe to ignore
        break;
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    console.error('Webhook handler error:', message);
    // Return 200 so Stripe doesn't keep retrying a permanent error
    return NextResponse.json({ error: message }, { status: 200 });
  }
}
