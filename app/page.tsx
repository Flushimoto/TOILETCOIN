'use client';
import { useEffect } from 'react';

export default function Page() {
  // enable keyboard skip links (accessibility)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        const el = document.getElementById('story');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <Header />

      <main>
        <Hero />

        <section id="story" className="section">
          <div className="container">
            <h2 className="h2">The Prophecy of Satoshi Flushimoto</h2>
            <p className="lead">
              Past midnight on a dead-still highway, Satoshi Flushimoto—more liquidations than wins—hunted for relief when destiny (and indigestion) struck.
            </p>
            <p>
              He found a forgotten gas station, a grimy stall, and—mid-poop, straining—the revelation: if the market is a toilet, it needs a Final Flush. Right there he deployed <strong>TOILETCOIN</strong> on Pump.fun, minted <strong>1,000,000,000</strong> supply, bought the first <strong>1,000,000</strong> as parody of Satoshi’s stash, scrawled the contract and crooked toilet logo on a tile (the Genesis Tile), jotted the Wipepaper on two-ply, and vanished into the night.
            </p>
            <p>
              Days later a janitor found the artifacts, posted them online, and the legend spread. The owner built a shrine over the sacred stall. Pilgrims now line up at the next-door stall; his profits? ~<strong>6,900,000×</strong>. At least someone matched Bitcoin’s growth.
            </p>
          </div>
        </section>

        <section id="wipepaper" className="section alt">
          <div className="container">
            <h2 className="h2">Wipepaper</h2>
            <pre className="paper">
TOILETCOIN — Wipepaper
Mission: Flush the market and clog the haters.
Supply: 1,000,000,000 (serious zeros).
Utility: None whatsoever.
Roadmap: 🚽
Exit Strategy: Pull the handle.
Future Vision: You better hold—one day this will be accepted at public bathrooms worldwide.
Partnership Lore: international plumbers, toilet & TP industry (parody).
Environment: carbon neutral, methane negative* (*trust the vibe).
Charity Meme: Adopt-A-Toilet (includes framed bowl NFT).
            </pre>
          </div>
        </section>

        <section id="cta" className="section">
          <div className="container cta">
            <div>
              <h3 className="h3">Ready for the Final Flush?</h3>
              <p className="muted">No utility. Only humility. Lore-powered community.</p>
            </div>
            <div className="cta-buttons">
              <a className="btn primary" href="https://pump.fun/" target="_blank" rel="noreferrer">Buy on Pump.fun</a>
              <a className="btn" href="https://dexscreener.com/" target="_blank" rel="noreferrer">View Chart</a>
              <a className="btn ghost" href="https://t.me/" target="_blank" rel="noreferrer">Join TG</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="header">
      <a href="#" className="brand">TOILETCOIN</a>
      <nav className="menu">
        <a className="menu-link" href="#story">Story</a>
        <a className="menu-link" href="#wipepaper">Wipepaper</a>
        <a className="menu-link" href="https://pump.fun/" target="_blank" rel="noreferrer">Buy</a>
        <a className="menu-link" href="https://dexscreener.com/" target="_blank" rel="noreferrer">Chart</a>
        <a className="menu-link" href="https://x.com/" target="_blank" rel="noreferrer">X</a>
        <a className="menu-link" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="display">The Final Flush</h1>
          <p className="sub">
            Born mid-poop by Satoshi Flushimoto. 1,000,000,000 supply. Utility: none. Lore: everything.
          </p>
          <div className="hero-ctas">
            <a className="btn primary" href="https://pump.fun/" target="_blank" rel="noreferrer">Buy on Pump.fun</a>
            <a className="btn" href="https://dexscreener.com/" target="_blank" rel="noreferrer">View Chart</a>
          </div>
        </div>
        <div className="hero-badge">
          <div className="badge">
            <div className="badge-ring"></div>
            <div className="badge-core"></div>
          </div>
          <div className="badge-caption">Flushimoto Shrine</div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container foot">
        <div className="contract">
          Contract: <span className="mono">So1aNaPUMPFUNCONTRACTADDR...</span>
        </div>
        <div className="small">
          © {new Date().getFullYear()} Toiletcoin — A satire about meme coins, degens, and destiny in a gas-station bathroom.
        </div>
      </div>
    </footer>
  );
}
