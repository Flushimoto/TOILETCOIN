'use client';
import { useEffect, useState } from 'react';

const CONTRACT = 'So1aNaPUMPFUNCONTRACTADDR...'; // <- replace with real mint

export default function Page() {
  const [copyOK, setCopyOK] = useState(false);

  function copyContract() {
    navigator.clipboard.writeText(CONTRACT).then(() => {
      setCopyOK(true);
      setTimeout(() => setCopyOK(false), 1200);
    }).catch(() => {});
  }

  // Smooth scroll for hash links
  useEffect(() => {
    const click = (e: any) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);

  return (
    <>
      {/* Full-bleed background (no shade) */}
      <picture aria-hidden>
        <source media="(max-width: 640px)" srcSet="/hero-mobile.jpg" />
        <source media="(max-width: 1024px)" srcSet="/hero-tablet.jpg" />
        <img src="/hero-desktop.jpg" alt="" className="bg-img" />
      </picture>

      {/* NAV */}
      <header className="nav">
        <a href="#" className="brand">TOILETCOIN</a>
        <nav className="nav-links">
          <a className="btn retro ghost" href="#story">Story</a>
          <a className="btn retro ghost" href="#wipepaper">Wipepaper</a>
          <a className="btn retro" href="#buy">Buy</a>
          <a className="btn retro ghost" href="https://dexscreener.com/" target="_blank" rel="noreferrer">Chart</a>
          <a className="btn retro ghost" href="https://x.com/" target="_blank" rel="noreferrer">X</a>
          <a className="btn retro ghost" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="display">The Final Flush</h1>
          <p className="sub">Born mid-poop by Satoshi Flushimoto. 1,000,000,000 supply. Utility: none. Lore: everything.</p>

          <div className="contract-card">
            <div className="contract-label">Contract</div>
            <button className="contract-value" onClick={copyContract} title="Click to copy">
              <span className="mono">{CONTRACT}</span>
            </button>
            <div className={`copied ${copyOK ? 'on' : ''}`}>Copied!</div>
          </div>

          <div className="hero-ctas">
            <a className="btn retro" href="#buy">Buy</a>
            <a className="btn retro ghost" href="https://dexscreener.com/" target="_blank" rel="noreferrer">Chart</a>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="section">
        <div className="container">
          <h2 className="h2">The Prophecy of Satoshi Flushimoto</h2>
          <p className="lead">
            Past midnight on a dead-still highway, Satoshi Flushimoto—more liquidations than wins—hunted for relief when destiny (and indigestion) struck.
          </p>
          <p>
            He found a forgotten gas station, a grimy stall, and—mid-poop, straining—the revelation: if the market is a toilet, it needs a Final Flush. Right there he deployed <strong>TOILETCOIN</strong> on Pump.fun, minted <strong>1,000,000,000</strong> supply, bought the first <strong>1,000,000</strong> as a parody of Satoshi’s stash, scrawled the contract and crooked toilet logo on a tile (the Genesis Tile), jotted the Wipepaper on two-ply, and vanished into the night.
          </p>
          <p>
            Days later a janitor found the artifacts, posted them online, and the legend spread. The owner built a statue over the sacred stall. Pilgrims now line up at the next-door stall; his profits? ~<strong>6,900,000×</strong>. At least someone matched Bitcoin’s growth.
          </p>
        </div>
      </section>

      {/* WIPEPAPER */}
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
Future Vision: You better hold — one day this will be accepted at public bathrooms worldwide.
Partnership Lore: international plumbers, toilet & TP industry (parody).
Environment: carbon neutral, methane negative* (*trust the vibe).
Charity Meme: Adopt-A-Toilet (includes framed bowl NFT).
          </pre>
        </div>
      </section>

      {/* BUY (JUPITER EMBED) */}
      <section id="buy" className="section buy">
        <div className="container">
          <h2 className="h2">Buy Toiletcoin</h2>
          <p className="muted">Swap via Jupiter. Replace the mint in the URL once you have it.</p>

          <div className="jupiter-frame">
            {/* Replace YOUR_MINT below with your real mint address when ready */}
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

      {/* FOOTER */}
      <footer className="footer">
        <div className="container foot">
          <div>© {new Date().getFullYear()} TOILETCOIN — satire, lore, community.</div>
          <div className="small">Not financial advice. Don’t trade with rent money.</div>
        </div>
      </footer>
    </>
  );
}
