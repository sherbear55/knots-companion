'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FOUNDING_SEAT_CAP,
  FOUNDING_SEATS_LEFT,
  FOUNDING_PRICE_MONTHLY,
  FOUNDING_PRICE_6MONTH,
  FOUNDING_PRICE_12MONTH,
} from '@/lib/founding';

type PlanId = 'monthly' | '6month' | '12month';

const plans = [
  {
    id: 'monthly' as PlanId,
    name: 'Monthly Founding',
    price: FOUNDING_PRICE_MONTHLY,
    billing: 'per month',
    billingNote: 'Billed monthly after trial · Cancel anytime',
    trialNote: '14-day free trial — card not charged until Day 15',
    refundNote: null,
    badge: 'Most Flexible',
    badgeColor: '#4A7C6F',
    includes: [
      'All 17 knots — full access',
      '21 reflection questions per knot',
      '4 Movement Deep Dive sessions',
      'Personal reflection journal',
      'Streak tracking & progress',
      'Founding rate locked forever',
      'Full App access when ready',
    ],
    notIncluded: ['eBook', 'Print book'],
    button: `Claim My Founding Seat — Start Free Trial`,
    highlight: false,
  },
  {
    id: '6month' as PlanId,
    name: '6-Month Founding',
    price: FOUNDING_PRICE_6MONTH,
    billing: 'every 6 months',
    billingNote: `$${(parseFloat(FOUNDING_PRICE_6MONTH) / 6).toFixed(2)}/month · Billed every 6 months after trial`,
    trialNote: '14-day free trial — card not charged until Day 15',
    refundNote: 'All-sales-final after Day 15',
    badge: 'Best Value',
    badgeColor: '#C49A6C',
    includes: [
      'Everything in Monthly',
      'Knots of Survival eBook',
      'Founding rate locked forever',
    ],
    notIncluded: ['Print book'],
    button: `Claim My Founding Seat — $${FOUNDING_PRICE_6MONTH} after trial`,
    highlight: true,
  },
  {
    id: '12month' as PlanId,
    name: '12-Month Founding',
    price: FOUNDING_PRICE_12MONTH,
    billing: 'per year',
    billingNote: `$${(parseFloat(FOUNDING_PRICE_12MONTH) / 12).toFixed(2)}/month · Billed annually after trial`,
    trialNote: '14-day free trial — card not charged until Day 15',
    refundNote: 'All-sales-final after Day 15',
    badge: 'Full Experience',
    badgeColor: '#B8847A',
    includes: [
      'Everything in 6-Month',
      'Signed print copy of the book',
      'Your name in the Acknowledgements',
      'Founding rate locked forever',
    ],
    notIncluded: [],
    button: `Claim My Founding Seat — $${FOUNDING_PRICE_12MONTH} after trial`,
    highlight: false,
  },
];

export default function PlansPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId>('monthly');

  const selectedPlan = plans.find(p => p.id === selected)!;

  const handleContinue = () => {
    // TODO: pass selected plan to Stripe checkout
    // For now: route to checkout placeholder
    router.push(`/checkout?plan=${selected}`);
  };

  const pct = Math.round(((FOUNDING_SEAT_CAP - FOUNDING_SEATS_LEFT) / FOUNDING_SEAT_CAP) * 100);

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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-white text-xl">∞</span>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#2C2C2C' }}>Choose Your Founding Plan</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            All plans include a 14-day free trial. Your card is not charged until Day 15.
          </p>
        </div>

        {/* Founding seats bar */}
        <div className="rounded-xl px-4 py-3 mb-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.88)', border: '1.5px solid #C49A6C66' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold" style={{ color: '#7D5C2E' }}>Founding Member Seats</span>
            <span className="text-xs font-bold" style={{ color: '#C49A6C' }}>{FOUNDING_SEATS_LEFT} of {FOUNDING_SEAT_CAP} remaining</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: '#E8F0ED' }}>
            <div className="h-1.5 rounded-full"
              style={{ width: `${pct}%`, backgroundColor: '#C49A6C', minWidth: pct > 0 ? '6px' : '0' }} />
          </div>
          <p className="text-xs mt-1.5 text-center" style={{ color: '#9CA3AF' }}>
            Your founding rate is locked forever — including when the Full App launches
          </p>
        </div>

        {/* Plan cards */}
        <div className="space-y-3 mb-6">
          {plans.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className="w-full rounded-2xl p-5 text-left transition-all"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.80)',
                  border: isSelected ? `2px solid ${plan.badgeColor}` : '1.5px solid #E8F0ED',
                  boxShadow: isSelected ? `0 4px 20px ${plan.badgeColor}22` : 'none',
                }}>

                {/* Plan header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Radio indicator */}
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: isSelected ? plan.badgeColor : '#D1D5DB',
                        backgroundColor: isSelected ? plan.badgeColor : 'transparent',
                      }}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold" style={{ color: '#2C2C2C' }}>{plan.name}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: plan.badgeColor + '22', color: plan.badgeColor }}>
                          {plan.badge}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{plan.billingNote}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl font-bold" style={{ color: plan.badgeColor }}>${plan.price}</span>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{plan.billing}</p>
                  </div>
                </div>

                {/* What's included */}
                <div className="ml-8 space-y-1.5">
                  {plan.includes.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: plan.badgeColor }}>✓</span>
                      <span className="text-xs" style={{ color: '#2C2C2C' }}>{item}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: '#D1D5DB' }}>◦</span>
                      <span className="text-xs" style={{ color: '#D1D5DB' }}>{item} — not included</span>
                    </div>
                  ))}
                </div>

                {/* Trial note */}
                {isSelected && (
                  <div className="mt-3 ml-8 rounded-lg px-3 py-2"
                    style={{ backgroundColor: plan.badgeColor + '12', border: `1px solid ${plan.badgeColor}33` }}>
                    <p className="text-xs font-medium" style={{ color: plan.badgeColor }}>
                      ✦ {plan.trialNote}
                    </p>
                    {plan.refundNote && (
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{plan.refundNote}</p>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* What all plans include */}
        <div className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.88)', border: '1px solid #E8F0ED' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#9CA3AF' }}>All founding plans include</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              '17 knots · full access',
              'All 21 questions per knot',
              '4 Movement Deep Dives',
              'Personal reflection journal',
              'Streak & progress tracking',
              '365 days of content',
              'Founding rate — locked forever',
              'Full App access when ready',
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <span className="text-xs" style={{ color: '#4A7C6F' }}>✓</span>
                <span className="text-xs" style={{ color: '#3D3D3D' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-xl text-sm font-semibold text-white mb-3 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#4A7C6F' }}>
          {selectedPlan.button}
        </button>

        <p className="text-xs text-center mb-6" style={{ color: '#9CA3AF' }}>
          {selected === 'monthly'
            ? 'No charge for 14 days · $6.99/month begins Day 15 · Cancel anytime'
            : `No charge for 14 days · ${selected === '6month' ? '$35.99' : '$64.99'} charged on Day 15 · All-sales-final`}
        </p>

        {/* Skip / explore free */}
        <div className="text-center">
          <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>Not ready to commit?</p>
          <Link href="/dashboard"
            className="text-sm font-medium"
            style={{ color: '#4A7C6F' }}>
            Explore free — 3 book questions per knot, no account needed →
          </Link>
        </div>

        <Link href="/" className="block text-center mt-6 text-xs" style={{ color: '#9CA3AF' }}>← Back to home</Link>
      </div>
    </div>
  );
}
