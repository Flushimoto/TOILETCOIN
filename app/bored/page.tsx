'use client';

export default function Page() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        background: '#111',
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
    </div>
  );
}
