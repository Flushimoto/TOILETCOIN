// TOILETCOIN — Background with ZERO shade/overlay

export default function Page() {
  return (
    <main className="root">
      {/* FULL background image, no filters */}
      <img
        src="/legendary-desktop.jpg"
        alt="Flushimoto scene in the legendary gas-station bathroom"
        className="bg-img"
      />

      {/* Top-right nav – keep or remove as you wish */}
      <div className="nav-wrap">
        <nav className="nav">
          <button className="link">Story</button>
          <button className="link">Wipepaper</button>
          <a className="link" href="https://pump.fun/" target="_blank" rel="noreferrer">Buy</a>
          <a className="link" href="https://dexscreener.com/" target="_blank" rel="noreferrer">Chart</a>
          <a className="link" href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">X</a>
          <a className="link" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
        </nav>
      </div>

      {/* Footer – I removed any dark background here too */}
      <footer className="footer-chip">
        Contract: <span className="mono">So1aNaPUMPFUNCONTRACTADDR...</span>
      </footer>
    </main>
  );
}
