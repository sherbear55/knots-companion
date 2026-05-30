'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ backgroundColor: '#FAF7F2', color: '#2C2C2C', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Something went wrong</h2>
        <button
          onClick={() => reset()}
          style={{ backgroundColor: '#4A7C6F', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
