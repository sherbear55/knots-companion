import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF7F2',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#4A7C6F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ color: '#fff', fontSize: '1.75rem' }}>∞</span>
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2C2C2C', marginBottom: '0.5rem' }}>
        Page not found
      </h1>
      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        This knot doesn&rsquo;t exist — let&rsquo;s get you back on the path.
      </p>
      <Link
        href="/"
        style={{
          backgroundColor: '#4A7C6F',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Return home
      </Link>
    </div>
  );
}
