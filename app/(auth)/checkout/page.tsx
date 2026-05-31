'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FOUNDING_PRICE_MONTHLY,
  FOUNDING_PRICE_6MONTH,
  FOUNDING_PRICE_12MONTH,
} from '@/lib/founding';

const planDetails: Record<string, { name: string; price: string; billing: string; chargeNote: string }> = {
  monthly: {
    name: 'Monthly Founding',
    price: FOUNDING_PRICE_MONTHLY,
    billing: '/month',
    chargeNote: `Your card will not be charged until Day 15. After your 14-day trial, $${FOUNDING_PRICE_MONTHLY}/month begins automatically. Cancel anytime before Day 15 and you will not be charged.`,
  },
  '6month': {
    name: '6-Month Founding',
    price: FOUNDING_PRICE_6MONTH,
    billing: 'every 6 months',
    chargeNote: `Your card will not be charged until Day 15. After your 14-day trial, $${FOUNDING_PRICE_6MONTH} is charged on Day 15. This plan is all-sales-final after Day 15.`,
  },
  '12month': {
    name: '12-Month Founding',
    price: FOUNDING_PRICE_12MONTH,
    billing: 'per year',
    chargeNote: `Your card will not be charged until Day 15. After your 14-day trial, $${FOUNDING_PRICE_12MONTH} is charged on Day 15. This plan is all-sales-final after Day 15. Your print book and eBook will ship within 30 days of your charge date.`,
  },
};

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') ?? 'monthly';
  const plan = planDetails[planId] ?? planDetails.monthly;

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Replace with Stripe payment intent / subscription creation
    await new Promise((r) => setTimeout(r, 1200));
    router.push('/dashboard');
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{plan.name}</span>
            <span className="text-sm font-bold" style={{ color: '#4A7C6F' }}>${plan.price}{plan.billing}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: '#6B7280' }}>Due today</span>
            <span className="text-sm font-bold" style={{ color: '#4A7C6F' }}>$0.00</span>
          </div>
          <div className="h-px mb-3" style={{ backgroundColor: '#E8F0ED' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{plan.chargeNote}</p>
        </div>

        {/* Payment form — Stripe Elements will replace this section */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: '1px solid #E8F0ED' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: '#9CA3AF' }}>
            Payment Details
          </p>

          {/* ── STRIPE ELEMENTS MOUNT POINT ──────────────────────────
              When Stripe is integrated:
              1. Replace the mock inputs below with <CardElement />
              2. On submit, call stripe.createPaymentMethod() then your
                 API route /api/stripe/create-subscription
              ──────────────────────────────────────────────────────── */}
          <div className="rounded-xl p-4 mb-4 text-center"
            style={{ backgroundColor: '#E8F0ED', border: '1.5px dashed #4A7C6F66' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#4A7C6F' }}>🔒 Stripe Secure Payment</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              Payment form will appear here once Stripe is connected.<br />
              Your card details are encrypted and never stored on our servers.
            </p>
          </div>

          {/* Mock card inputs — placeholder only */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Card number</label>
              <input type="text" placeholder="•••• •••• •••• ••••" disabled
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#E8F0ED', backgroundColor: '#F9FAFB', color: '#9CA3AF' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Expiry</label>
                <input type="text" placeholder="MM / YY" disabled
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ borderColor: '#E8F0ED', backgroundColor: '#F9FAFB', color: '#9CA3AF' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>CVC</label>
                <input type="text" placeholder="•••" disabled
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ borderColor: '#E8F0ED', backgroundColor: '#F9FAFB', color: '#9CA3AF' }} />
              </div>
            </div>

            <div className="rounded-lg px-3 py-2" style={{ backgroundColor: '#4A7C6F12', border: '1px solid #4A7C6F33' }}>
              <p className="text-xs" style={{ color: '#2E5249' }}>
                🔒 Your payment is secured by Stripe. We never see or store your card number.
              </p>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-4 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: submitting ? '#9CA3AF' : '#4A7C6F' }}>
              {submitting ? 'Setting up your trial…' : 'Start My 14-Day Free Trial'}
            </button>
          </form>
        </div>

        {/* Refund / terms */}
        <p className="text-xs text-center mb-4" style={{ color: '#9CA3AF' }}>
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
