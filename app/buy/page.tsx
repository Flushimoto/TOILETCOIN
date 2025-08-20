export default function BuyPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container">
          <h1 className="h1">Buy Toiletcoin</h1>
          <p className="muted">Swap via Jupiter. Replace the mint in the URL once you have it.</p>

          <div className="jupiter-frame">
            {/* TODO: replace <YOUR_MINT_ADDRESS> with your real mint */}
            <iframe
              title="Jupiter Swap"
              src="https://jup.ag/swap/SOL-<YOUR_MINT_ADDRESS>"
              allow="clipboard-read; clipboard-write; fullscreen; payment;"
              loading="lazy"
            />
          </div>

          <div className="alt-links">
            Prefer another route?
            <a href="https://pump.fun/" target="_blank" rel="noreferrer">Pump.fun</a>
            <span>·</span>
            <a href="https://dexscreener.com/" target="_blank" rel="noreferrer">Dexscreener</a>
            <span>·</span>
            <a href="https://phantom.app/" target="_blank" rel="noreferrer">Phantom</a>
          </div>
        </div>
      </section>
    </main>
  );
}
