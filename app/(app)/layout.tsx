'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#4A7C6F' : 'none'} stroke={active ? '#4A7C6F' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: '/journey', label: 'Knots', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4A7C6F' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  )},
  { href: '/history', label: 'Journal', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4A7C6F' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )},
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>

      {/* Book cover background — increased opacity for more presence */}
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

      {/* Soft warm overlay — lightened so the image shows through more */}
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

      {/* Top branding bar */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'rgba(250,247,242,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: '#E8F0ED',
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-2" style={{ position: 'relative', zIndex: 1 }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-white text-sm">∞</span>
          </div>
          <div>
            <p className="text-sm font-bold leading-tight" style={{ color: '#2C2C2C' }}>Knots of Survival</p>
            <p className="text-xs font-medium leading-tight" style={{ color: '#4A7C6F' }}>Caregiver Companion</p>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      {/* Bottom nav — frosted glass */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t z-50"
        style={{
          backgroundColor: 'rgba(250,247,242,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: '#E8F0ED',
        }}
      >
        <div className="max-w-lg mx-auto flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5"
              >
                {item.icon(isActive)}
                <span className="text-xs font-medium" style={{ color: isActive ? '#4A7C6F' : '#9CA3AF' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
