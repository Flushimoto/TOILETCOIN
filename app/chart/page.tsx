export default function ChartPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container">
          <h1 className="h1">Chart</h1>
          <p className="muted">Live data from Dexscreener.</p>

          <div className="dex-frame">
            {/* TODO: replace the URL with your real Dexscreener pair link when available */}
            <iframe
              title="Dexscreener"
              src="https://dexscreener.com/solana"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
