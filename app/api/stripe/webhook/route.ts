import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Locked rates by plan for founding members
const FOUNDING_LOCKED_RATES: Record<string, number> = {
  monthly:   6.99,
  '6month':  35.99,
  '12month': 64.99,
};

// Flodesk segment IDs by plan
const FLODESK_SEGMENT_IDS: Record<string, string> = {
  monthly:  '6a3937dd2af0bfd78767949e',
  '6month': '6a3937ecf5968997758b3fa3',
  '12month':'6a3937faad2808ebee2eea2d',
};

async function addSubscriberToFlodesk(
  email: string,
  firstName: string,
  planId: string
): Promise<void> {
  const apiKey = process.env.FLODESK_API_KEY;
  if (!apiKey) {
    console.error('Missing FLODESK_API_KEY environment variable');
    return;
  }

  const segmentId = FLODESK_SEGMENT_IDS[planId];
  if (!segmentId) {
    console.error(`No Flodesk segment found for plan: ${planId}`);
    return;
  }

  const credentials = Buffer.from(`${apiKey}:`).toString('base64');

  try {
    const response = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name: firstName || '',
        segment_ids: [segmentId],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Flodesk API error ${response.status}: ${errorText}`);
    } else {
      console.log(`Flodesk: subscriber ${email} added to segment ${planId} (${segmentId})`);
    }
  } catch (err) {
    console.error('Flodesk fetch error:', err instanceof Error ? err.message : err);
  }
}

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

      // ── Checkout completed → user finished Stripe payment/trial setup ──────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );

        const supabaseUserId  = session.metadata?.supabase_user_id;
        const planId          = session.metadata?.plan_id ?? subscription.metadata?.plan_id;
        const customerId      = session.customer as string;
        const trialEndsAt     = subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null;

        // Determine member tier from the founding flag set at checkout
        const isFoundingMember = subscription.metadata?.is_founding === 'true';

        const updatePayload = {
          tier:               isFoundingMember ? 'founder' : 'paid',
          is_founding:        isFoundingMember,
          plan:               planId ?? null,
          cohort:             isFoundingMember ? 'founding' : null,
          locked_rate:        isFoundingMember && planId ? (FOUNDING_LOCKED_RATES[planId] ?? null) : null,
          stripe_customer_id: customerId,
          trial_ends_at:      trialEndsAt,
        };

        if (supabaseUserId) {
          const { error } = await supabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', supabaseUserId);
          if (error) console.error('Profile update error (by id):', error);
        } else {
          const email = session.customer_details?.email ?? session.customer_email;
          if (email) {
            const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
            const match = data?.users?.find((u: { email?: string }) => u.email === email);
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

        // ── Add subscriber to Flodesk segment based on plan ──────────────────────
        if (planId) {
          const customerEmail = session.customer_details?.email ?? session.customer_email ?? '';
          const customerName  = session.customer_details?.name ?? '';
          const firstName     = customerName.split(' ')[0] ?? '';
          await addSubscriberToFlodesk(customerEmail, firstName, planId);
        }

        break;
      }

      // ── Subscription updated (trial → active, plan change, etc.) ─────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (subscription.status === 'active') {
          // Trial ended, subscription is now fully active — clear trial window
          await supabase
            .from('profiles')
            .update({ trial_ends_at: null })
            .eq('stripe_customer_id', customerId);
        }

        if (subscription.status === 'canceled') {
          // Cancellation — founding status is permanently lost per membership rules
          await supabase
            .from('profiles')
            .update({
              tier: 'member',
              is_founding: false,
              trial_ends_at: null,
              cohort: null,
              locked_rate: null,
            })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      // ── Subscription deleted (expired, payment failed, cancelled) ─────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('profiles')
          .update({
            tier: 'member',
            is_founding: false,
            trial_ends_at: null,
            cohort: null,
            locked_rate: null,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    console.error('Webhook handler error:', message);
    return NextResponse.json({ error: message }, { status: 200 });
  }
}
