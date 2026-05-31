import Stripe from 'stripe';

// Lazy initialization — Stripe is created on first use (runtime), not at build time.
// This prevents Vercel build failures caused by missing env vars during the build step.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-05-27.dahlia',
      typescript: true,
    });
  }
  return _stripe;
}
