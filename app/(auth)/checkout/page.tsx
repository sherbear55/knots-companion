'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FOUNDING_PRICE_MONTHLY,
  FOUNDING_PRICE_6MONTH,
  FOUNDING_PRICE_12MONTH,
} from '@/lib/founding';

const planDetails: Record<string, {
  name: string;
  price: string;
  billing: string;
  chargeNote: string;
  badge: string;
  badgeColor: string;
}> = {
  monthly: {
    name: 'Monthly Founding',
    price: FOUNDING_PRICE_MONTHLY,
    billing: '/month',
    badge: 'Most Flexible',
    badgeColor: '#4A7C6F',
    chargeNote: `Your card will not be charged until Day 15. After your 14-day trial, $${FOUNDING_PRICE_MONTHLY}/month begins automatically. Cancel anytime before Day 15 and you will not be charged.`,
  },
  '6month': {
    name: '6-Month Founding',
    price: FOUNDING_PRICE_6MONTH,
    billing: 'every 6 months',
    badge: 'Best Value',
    badgeColor: '#C49A6C',
    chargeNote: `Your card will not be charged until Day 15. After your 14-day trial, $${FOUNDING_PRICE_6MONTH} is charged on Day 15. This plan is all-sales-final after Day 15.`,
  },
  '12month': {
    name: '12-Month Founding',
    price: FOUNDING_PRICE_12MONTH,
    billing: 'per year',
    badge: 'Full Experience',
    badgeColor: '#B8847A',
    chargeNote: `Your card will not be charged until Day 15. After your 14-day trial, $${FOUNDING_PRICE_12MONTH} is charged on Day 15. This plan is all-sales-final after Day 15. Your print book and eBook ship within 30 days of your charge date.`,
  },
};

function CheckoutForm() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') ?? 'monthly';
  const plan = planDetails[planId] ?? planDetails.monthly;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Could not start checkout. Please try again.');
      }

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#FAF7F2', position: 'relative' }}>

      {/* Background */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: "url('/cover-bg.jpg')", backgroundSize: 'cover',
        backgroundPosition: 'center 42%', backgroundRepeat: 'no-repeat', opacity: 0.32,
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(250,247,242,0.38) 0%, rgba(250,247,242,0.22) 50%, rgba(250,247,242,0.38) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', margin: '0 auto' }}>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-white text-xl">∞</span>
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: '#2C2C2C' }}>Secure Checkout</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>Your card will not be charged for 14 days</p>
        </div>

        {/* Order summary */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: '1px solid #E8F0ED' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#9CA3AF' }}>Order Summary</p>

          {/* Plan badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: plan.badgeColor + '22', color: plan.badgeColor }}>
              {plan.badge}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{plan.name}</span>
            <span className="text-sm font-bold" style={{ color: plan.badgeColor }}>${plan.price}{plan.billing}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: '#6B7280' }}>Due today</span>
            <span className="text-sm font-bold" style={{ color: '#4A7C6F' }}>$0.00</span>
          </div>
          <div className="h-px mb-3" style={{ backgroundColor: '#E8F0ED' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{plan.chargeNote}</p>
        </div>

        {/* What happens next */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: '1px solid #E8F0ED' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#9CA3AF' }}>What happens next</p>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Enter your card on Stripe\'s secure page — we never see your card number' },
              { step: '2', text: '14-day free trial begins immediately — explore everything, no charge' },
              { step: '3', text: 'Day 15: your founding rate locks in and billing begins' },
              { step: '4', text: 'Cancel anytime from your account — no hoops, no guilt' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#4A7C6F22' }}>
                  <span className="text-xs font-bold" style={{ color: '#4A7C6F' }}>{step}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#3D3D3D' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <div className="rounded-xl px-4 py-3 mb-5 flex items-center gap-3"
          style={{ backgroundColor: '#4A7C6F0D', border: '1px solid #4A7C6F33' }}>
          <span className="text-lg flex-shrink-0">🔒</span>
          <p className="text-xs" style={{ color: '#2E5249' }}>
            Payments are processed securely by <strong>Stripe</strong> — the same technology used by Amazon, Google, and millions of businesses worldwide. We never store your card details.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-xl px-4 py-3 mb-4"
            style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
            <p className="text-xs font-medium" style={{ color: '#DC2626' }}>⚠ {error}</p>
          </div>
        )}

        {/* CTA — redirects to Stripe */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl text-sm font-semibold text-white mb-3 hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ backgroundColor: '#4A7C6F' }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Redirecting to secure checkout…
            </span>
          ) : (
            'Start My 14-Day Free Trial →'
          )}
        </button>

        <p className="text-xs text-center mb-6" style={{ color: '#9CA3AF' }}>
          By continuing you agree to the{' '}
          <Link href="/terms" style={{ color: '#4A7C6F' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#4A7C6F' }}>Privacy Policy</Link>.
        </p>

        <Link href="/plans" className="block text-center text-xs" style={{ color: '#9CA3AF' }}>
          ← Change plan
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <p style={{ color: '#9CA3AF' }}>Loading…</p>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
