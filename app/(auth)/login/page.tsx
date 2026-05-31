'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Email or password is incorrect. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
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

        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-white text-2xl">∞</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>Knots of Survival</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Caregiver Companion</p>
        </div>

        <div className="w-full max-w-sm rounded-2xl shadow-sm p-7"
          style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: '1px solid #E8F0ED' }}>
          <h2 className="text-xl font-semibold mb-1" style={{ color: '#2C2C2C' }}>Welcome back</h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Continue your reflection journey</p>

          {error && (
            <div className="rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
              <p className="text-xs" style={{ color: '#DC2626' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="••••••••" required
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                style={{ borderColor: '#E8F0ED', backgroundColor: '#FAF7F2', color: '#2C2C2C' }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: loading ? '#9CA3AF' : '#4A7C6F' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 border-t" style={{ borderColor: '#E8F0ED' }} />
            <span className="mx-3 text-xs" style={{ color: '#9CA3AF' }}>or</span>
            <div className="flex-1 border-t" style={{ borderColor: '#E8F0ED' }} />
          </div>

          <Link href="/dashboard"
            className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold border hover:bg-[#E8F0ED] transition-colors"
            style={{ borderColor: '#4A7C6F', color: '#4A7C6F' }}>
            Explore Free — No Account Needed →
          </Link>

          <p className="text-xs text-center mt-5" style={{ color: '#6B7280' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium" style={{ color: '#4A7C6F' }}>Start your journey →</Link>
          </p>
        </div>

        <Link href="/" className="mt-6 text-xs" style={{ color: '#9CA3AF' }}>← Back to home</Link>
      </div>
    </div>
  );
}
