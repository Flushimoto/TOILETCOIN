'use client';

export default function Page() {
  return (
    <main
      style={{
        color: '#fff',
        background: '#111',
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <div>
        <h1 style={{ margin: 0 }}>Bored?</h1>
        <p style={{ opacity: 0.8 }}>
          Mini-game coming soon. For now, go flush the chart or read the Wipepaper.
        </p>
      </div>
    </main>
  );
}
