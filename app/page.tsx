import Link from 'next/link';

const knots = [
  { id: 1, name: 'Being Seen', movement: 'Surviving the Current' }, { id: 2, name: 'Grace', movement: 'Surviving the Current' },
  { id: 3, name: 'Emotional Release', movement: 'Surviving the Current' }, { id: 4, name: 'Releasing Expectations', movement: 'Loosening the Weight' },
  { id: 5, name: 'Humor', movement: 'Loosening the Weight' }, { id: 6, name: 'Joy', movement: 'Loosening the Weight' },
  { id: 7, name: 'Time Alone', movement: 'Return to Self & the Sacred' }, { id: 8, name: 'Sacred Moments', movement: 'Return to Self & the Sacred' },
  { id: 9, name: 'Ritual', movement: 'Return to Self & the Sacred' }, { id: 10, name: 'Permission', movement: 'Return to Self & the Sacred' },
  { id: 11, name: 'Self-Compassion', movement: 'Return to Self & the Sacred' }, { id: 12, name: 'Self-Care', movement: 'Return to Self & the Sacred' },
  { id: 13, name: 'Boundaries', movement: 'Return to Self & the Sacred' }, { id: 14, name: 'Witnessing', movement: 'Return to Self & the Sacred' },
  { id: 15, name: 'Surrender', movement: 'Trust' }, { id: 16, name: 'Forgiveness', movement: 'Trust' },
  { id: 17, name: 'Peace', movement: 'Trust' },
];

const movementColors: Record<string, string> = {
  'Surviving the Current': '#4A7C6F',
  'Loosening the Weight': '#C49A6C',
  'Return to Self & the Sacred': '#B8847A',
  'Trust': '#7C6F4A',
};

const features = [
  { icon: '🧵', title: '365 Days of Daily Reflection — One Full Year', desc: "17 knots × 21 questions each + 8 Movement Deep Dives = one full year of reflection." },
  { icon: '📓', title: 'Personal Reflection Journal', desc: 'Write your response each day. Your entries are private, yours alone.' },
  { icon: '🔥', title: 'Streaks & Progress Tracking', desc: 'Build a daily reflection habit with streak tracking and knot progress.' },
  { icon: '🪢', title: 'Grounded in the Book', desc: "Grounded in Sherry Petty's book — plus hundreds of exclusive reflection questions available only inside the app." },
];

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#FAF7F2', color: '#2C2C2C', position: 'relative' }}>

      {/* Book cover background — same treatment as app interior */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: "url('/cover-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.32,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(250,247,242,0.38) 0%, rgba(250,247,242,0.22) 50%, rgba(250,247,242,0.38) 100%)',
        }}
      />

      {/* All content sits above the background */}
      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#FAF7F2CC', backdropFilter: 'blur(12px)', borderColor: '#E8F0ED' }}>
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4A7C6F' }}>
              <span className="text-white text-base">∞</span>
            </div>
            <div>
              <p className="text-lg font-bold leading-tight" style={{ color: '#2C2C2C' }}>Knots of Survival</p>
              <p className="text-sm font-medium leading-tight" style={{ color: '#4A7C6F' }}>Caregiver Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium px-4 py-1.5 rounded-lg" style={{ color: '#4A7C6F' }}>Sign In</Link>
            <Link href="/signup" className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#4A7C6F' }}>Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-5 pt-16 pb-12 text-center">
        <div className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: '#E8F0ED', color: '#4A7C6F' }}>
          Builder Tier · Now Available
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-5" style={{ color: '#2C2C2C' }}>
          You don&apos;t have to carry this <span style={{ color: '#4A7C6F' }}>alone.</span>
        </h1>
        <p className="text-lg leading-relaxed mb-4" style={{ color: '#3D3D3D' }}>
          A daily reflection companion for caregivers — grounded in 17 knots of wisdom, one honest question at a time.
        </p>
        <p className="text-sm italic mb-8 px-4 py-2 rounded-xl inline-block" style={{ color: '#5C3D0E', backgroundColor: 'rgba(250,247,242,0.72)', backdropFilter: 'blur(4px)' }}>
          &ldquo;You are not invisible. What you are carrying is real, and you are allowed to let it be witnessed.&rdquo;
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white text-center hover:opacity-90 transition-opacity" style={{ backgroundColor: '#4A7C6F' }}>
            Begin My Journey — $6.99/month
          </Link>
          <Link href="/dashboard" className="px-8 py-3.5 rounded-xl text-sm font-semibold text-center border hover:bg-[#E8F0ED] transition-colors" style={{ borderColor: '#4A7C6F', color: '#4A7C6F' }}>
            Try Demo First →
          </Link>
        </div>
        <p className="text-xs mt-4" style={{ color: '#5A5A5A' }}><Link href="/signup" style={{ color: '#4A7C6F', fontWeight: 600 }}>Start your 14-day free trial</Link> · Cancel anytime · 365 days of content</p>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-5 pb-14">
        <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#2C2C2C' }}>How it works</h2>
        <p className="text-sm text-center mb-8" style={{ color: '#5A5A5A' }}>One question. Each day. At whatever pace you need.</p>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { step: '1', color: '#4A7C6F', title: 'You receive one reflection', desc: "Each day brings one question — a Knot's Truth or an anchor question drawn from the book." },
            { step: '2', color: '#C49A6C', title: 'You write your response', desc: 'Your journal is private. Write as much or as little as you need. There is no wrong answer.' },
            { step: '3', color: '#B8847A', title: 'You build your knot', desc: "Each knot has 21 reflection questions plus the Knot's Truth — work through them at your own pace." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #E8F0ED' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3" style={{ backgroundColor: s.color }}>{s.step}</div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C' }}>{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-5 pb-14">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: '#2C2C2C' }}>What&apos;s included</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl p-5 flex gap-4" style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #E8F0ED' }}>
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#2C2C2C' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 17 Knots grid */}
      <section className="py-12 px-5" style={{ backgroundColor: 'rgba(255,255,255,0.75)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#2C2C2C' }}>The 17 Knots</h2>
          <p className="text-sm text-center mb-8" style={{ color: '#9CA3AF' }}>Four Movements · One path home to yourself</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {knots.map((knot) => {
              const color = movementColors[knot.movement];
              return (
                <div key={knot.id} className="rounded-xl p-3 text-center" style={{ backgroundColor: color + '12', border: `1px solid ${color}22` }}>
                  <p className="text-xs font-bold mb-0.5" style={{ color }}>{knot.id}</p>
                  <p className="text-xs font-semibold leading-tight" style={{ color: '#2C2C2C' }}>{knot.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{knot.movement}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-5 py-14">
        <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#2C2C2C' }}>Simple, honest pricing</h2>
        <p className="text-sm text-center mb-8" style={{ color: '#9CA3AF' }}>No app store markups. Subscribed directly — more reaches you.</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.90)', border: '2px solid #4A7C6F', boxShadow: '0 4px 20px rgba(74,124,111,0.1)' }}>
            <div className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4" style={{ backgroundColor: '#4A7C6F', color: '#ffffff' }}>Available Now</div>
            <h3 className="text-lg font-bold mb-1" style={{ color: '#2C2C2C' }}>Builder Tier</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold" style={{ color: '#4A7C6F' }}>$6.99</span>
              <span className="text-sm" style={{ color: '#9CA3AF' }}>/ month</span>
            </div>
            <ul className="space-y-2 mb-6">
              {['365 days of daily reflections', '17 Knots · Why / What / Where', 'Personal reflection journal', 'Streak tracking & progress', 'All future content updates', 'Full App access when ready'].map((item) => (
                <li key={item} className="text-sm flex items-center gap-2" style={{ color: '#2C2C2C' }}><span style={{ color: '#4A7C6F' }}>✓</span> {item}</li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#4A7C6F' }}>
              Start Free Trial
            </Link>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(250,247,242,0.85)', border: '1px solid #E8F0ED', opacity: 0.8 }}>
            <div className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4" style={{ backgroundColor: '#E8F0ED', color: '#9CA3AF' }}>Coming Soon</div>
            <h3 className="text-lg font-bold mb-1" style={{ color: '#2C2C2C' }}>Full App Tier</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold" style={{ color: '#9CA3AF' }}>$15</span>
              <span className="text-sm" style={{ color: '#9CA3AF' }}>/ month</span>
            </div>
            <ul className="space-y-2 mb-6">
              {['Everything in Builder', 'Mood & energy tracking', 'Push notification reminders', 'Digital book integration', 'Caregiver community forums', 'Annual print book option'].map((item) => (
                <li key={item} className="text-sm flex items-center gap-2" style={{ color: '#9CA3AF' }}><span>◦</span> {item}</li>
              ))}
            </ul>
            <div className="w-full text-center py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#E8F0ED', color: '#9CA3AF' }}>
              Join Builder Tier to be First Notified
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-14 px-5 text-center" style={{ backgroundColor: '#4A7C6F' }}>
        <div className="max-w-xl mx-auto">
          <p className="text-lg font-medium leading-relaxed mb-3 text-white">
            &ldquo;The sea may not always grow still,<br />but something in you can.&rdquo;
          </p>
          <p className="text-sm mb-8" style={{ color: '#C8DED9' }}>— Knot of Peace, Knots of Survival</p>
          <Link href="/signup" className="inline-block px-8 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#C49A6C', color: '#ffffff' }}>
            Begin My 365-Day Journey
          </Link>
          <p className="text-xs mt-4" style={{ color: '#C8DED9' }}>
            Or <Link href="/dashboard" style={{ color: '#ffffff', textDecoration: 'underline' }}>try the demo</Link> with no account required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 text-center border-t" style={{ borderColor: '#E8F0ED', backgroundColor: 'rgba(250,247,242,0.90)' }}>
        <p className="text-xs" style={{ color: '#9CA3AF' }}>
          © 2025 Knots of Survival · Sherry Petty ·{' '}
          <Link href="/login" style={{ color: '#4A7C6F' }}>Sign In</Link> ·{' '}
          <Link href="/signup" style={{ color: '#4A7C6F' }}>Start Free</Link>
        </p>
        <p className="text-xs mt-1" style={{ color: '#C8C0B8' }}>Built with care, for caregivers who carry everything.</p>
      </footer>

      </div>{/* end z-index wrapper */}
    </div>
  );
}
