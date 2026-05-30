'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: '#FAF7F2', position: 'relative' }}>

      {/* Background image */}
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
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-white text-2xl">∞</span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>Knots of Survival</h1>
          <p className="text-sm font-medium mt-1" style={{ color: '#4A7C6F' }}>Caregiver Companion</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm rounded-2xl shadow-sm p-7" style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: '1px solid #E8F0ED' }}>
          <h2 className="text-xl font-semibold mb-1" style={{ color: '#2C2C2C' }}>Begin your journey</h2>
          <p className="text-sm mb-1" style={{ color: '#5A5A5A' }}>365 days of guided reflection — one knot at a time</p>
          <p className="text-xs mb-6 font-medium" style={{ color: '#4A7C6F' }}>14-day free trial · $6.99/month after · Cancel anytime</p>

          <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name"
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none" style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none" style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password"
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none" style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#4A7C6F' }}>
              Start My Free Trial
            </button>
          </form>

          {/* Pricing summary */}
          <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: '#E8F0ED', border: '1px solid #4A7C6F22' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>Builder Tier</span>
              <span className="text-sm font-bold" style={{ color: '#4A7C6F' }}>$6.99 / month</span>
            </div>
            <ul className="space-y-1">
              {[
                '365 days of daily reflections',
                '17 Knots × Why / What / Where',
                '4 Movement Deep Dive sessions',
                'Personal reflection journal',
                'Progress tracking',
                'Full App tier access when ready',
              ].map((item) => (
                <li key={item} className="text-xs flex items-center gap-2" style={{ color: '#3D5A54' }}>
                  <span>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

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
