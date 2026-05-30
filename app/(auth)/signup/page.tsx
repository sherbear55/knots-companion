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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="mb-6 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#4A7C6F' }}>
          <span className="text-white text-2xl">∞</span>
        </div>
        <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>Knots of Survival</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Caregiver Companion</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl shadow-sm p-7" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
        <h2 className="text-xl font-semibold mb-1" style={{ color: '#2C2C2C' }}>Begin your journey</h2>
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>374 days of guided reflection — one knot at a time</p>

        <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Your name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name"
              className="w-full px-3 py-2.5 rounded-lg text-sm border" style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm border" style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password"
              className="w-full px-3 py-2.5 rounded-lg text-sm border" style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#4A7C6F' }}>
            Create My Account
          </button>
        </form>

        <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: '#E8F0ED', border: '1px solid #4A7C6F22' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>Builder Tier</span>
            <span className="text-sm font-bold" style={{ color: '#4A7C6F' }}>$9 / month</span>
          </div>
          <ul className="space-y-1">
            {['374 days of daily reflections', '17 Knots × Why / What / Where', 'Personal reflection journal', 'Progress tracking & streaks', 'Full App tier coming soon'].map((item) => (
              <li key={item} className="text-xs flex items-center gap-2" style={{ color: '#4A7C6F' }}>
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
      <Link href="/" className="mt-6 text-xs" style={{ color: '#9CA3AF' }}>← Back to home</Link>
    </div>
  );
}
