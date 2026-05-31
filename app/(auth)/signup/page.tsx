'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  FOUNDING_SEAT_CAP,
  FOUNDING_SEATS_LEFT,
  FOUNDING_PRICE_MONTHLY,
} from '@/lib/founding';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pct = Math.round(((FOUNDING_SEAT_CAP - FOUNDING_SEATS_LEFT) / FOUNDING_SEAT_CAP) * 100);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Account created — move to plan selection
    router.push('/plans');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#FAF7F2', position: 'relative' }}>

      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: "url('/cover-bg.jpg')", backgroundSize: 'cover',
        backgroundPosition: 'center 42%', backgroundRepeat: 'no-repeat', opacity: 0.32,
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(250,247,242,0.38) 0%, rgba(250,247,242,0.22) 50%, rgba(250,247,242,0.38) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div className="mb-5 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-white text-2xl">∞</span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>Knots of Survival</h1>
          <p className="text-sm font-medium mt-1" style={{ color: '#4A7C6F' }}>Caregiver Companion</p>
        </div>

        {/* Founding seats counter */}
        <div className="w-full max-w-sm rounded-xl px-4 py-3 mb-4"
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
            Founding rate of ${FOUNDING_PRICE_MONTHLY}/mo locked forever
          </p>
        </div>

        <div className="w-full max-w-sm rounded-2xl shadow-sm p-7"
          style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: '1px solid #E8F0ED' }}>
          <h2 className="text-xl font-semibold mb-1" style={{ color: '#2C2C2C' }}>Begin your journey</h2>
          <p className="text-sm mb-1" style={{ color: '#5A5A5A' }}>365 days of guided reflection — one knot at a time</p>
          <p className="text-xs mb-6 font-medium" style={{ color: '#4A7C6F' }}>14-day free trial · ${FOUNDING_PRICE_MONTHLY}/month after · Cancel anytime</p>

          {error && (
            <div className="rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
              <p className="text-xs" style={{ color: '#DC2626' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="First name" required
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters" required minLength={6}
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: loading ? '#9CA3AF' : '#4A7C6F' }}>
              {loading ? 'Creating your account…' : 'Create Account & Choose Plan'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8F0ED' }} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8F0ED' }} />
          </div>

          <Link href="/dashboard"
            className="block w-full text-center py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-[#E8F0ED]"
            style={{ borderColor: '#4A7C6F', color: '#4A7C6F' }}>
            Explore Free — No Account Needed →
          </Link>
          <p className="text-xs text-center mt-2" style={{ color: '#9CA3AF' }}>
            3 book questions per knot · Journal doesn&apos;t save without an account
          </p>

          <p className="text-xs text-center mt-5" style={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#4A7C6F' }}>Sign in →</Link>
          </p>
        </div>

        <Link href="/" className="mt-6 text-xs" style={{ color: '#6B7280' }}>← Back to home</Link>
      </div>
    </div>
  );
}
