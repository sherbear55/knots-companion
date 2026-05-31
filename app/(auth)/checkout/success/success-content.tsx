'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const planNames: Record<string, string> = {
  monthly:  'Monthly Founding',
  '6month': '6-Month Founding',
  '12month': '12-Month Founding',
};

function SuccessInner() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') ?? 'monthly';
  const planName = planNames[planId] ?? 'Founding';

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center"
      style={{ backgroundColor: '#FAF7F2', position: 'relative' }}>

      {/* Background */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: "url('/cover-bg.jpg')", backgroundSize: 'cover',
        backgroundPosition: 'center 42%', backgroundRepeat: 'no-repeat', opacity: 0.24,
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(250,247,242,0.5) 0%, rgba(250,247,242,0.3) 50%, rgba(250,247,242,0.5) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px', width: '100%' }}>

        {/* Success card */}
        <div className="rounded-3xl p-8 text-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.96)', border: '1.5px solid #4A7C6F33',
            boxShadow: '0 8px 40px #4A7C6F18' }}>

          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-4xl">∞</span>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
            You&rsquo;re in, Founding Member! 🎉
          </h1>

          <p className="text-sm mb-1" style={{ color: '#6B7280' }}>
            <strong style={{ color: '#4A7C6F' }}>{planName}</strong> · 14-day free trial started
          </p>

          <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B7280' }}>
            Welcome to <em>Knots of Survival</em>. Your founding rate is locked in forever.
            Your card won&rsquo;t be charged until Day 15 — explore everything freely until then.
          </p>

          <div className="h-px mb-6" style={{ backgroundColor: '#E8F0ED' }} />

          <div className="text-left mb-6 space-y-2">
            {[
              '17 knots — all unlocked and ready',
              '21 reflection questions per knot',
              'Your personal journal starts fresh today',
              'Streak tracking begins with your first knot',
              'Your founding rate is locked — forever',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-sm" style={{ color: '#4A7C6F' }}>✓</span>
                <span className="text-sm" style={{ color: '#3D3D3D' }}>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="block w-full py-4 rounded-xl text-sm font-semibold text-white text-center hover:opacity-90 transition-opacity mb-3"
            style={{ backgroundColor: '#4A7C6F' }}>
            Begin My First Knot →
          </Link>

          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            A confirmation email is on its way from Stripe.{' '}
            <Link href="/dashboard" style={{ color: '#4A7C6F' }}>Go to your dashboard</Link> anytime.
          </p>
        </div>

        <p className="text-xs text-center mt-4 px-4" style={{ color: '#9CA3AF' }}>
          You are one of the first 100 founding members of <em>Knots of Survival</em>.
          Thank you for believing in this work. ♥
        </p>
      </div>
    </div>
  );
}

export function SuccessContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <p style={{ color: '#9CA3AF' }}>Loading…</p>
      </div>
    }>
      <SuccessInner />
    </Suspense>
  );
}
