'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [open, setOpen] = useState<null | 'story' | 'wipepaper'>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="root">
      {/* Background wash */}
      <div className="bg-overlay" aria-hidden />

      {/* Top-right nav */}
      <div className="nav-wrap">
        <nav className="nav">
          <button className="link" onClick={() => setOpen('story')}>Story</button>
          <button className="link" onClick={() => setOpen('wipepaper')}>Wipepaper</button>
          <a className="link" href="https://pump.fun/" target="_blank" rel="noreferrer">Buy</a>
          <a className="link" href="https://dexscreener.com/" target="_blank" rel="noreferrer">Chart</a>
          <a className="link" href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">X</a>
          <a className="link" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
        </nav>
      </div>

      {/* Center statue-on-toilet with art-directed sources */}
      <section className="center">
        <div className="statue-frame">
          <picture>
            {/* Mobile portrait (tight) */}
            <source media="(max-width: 640px)" srcSet="/legendary-mobile.jpg" />
            {/* Tablet 4:3 */}
            <source media="(max-width: 1024px)" srcSet="/legendary-tablet.jpg" />
            {/* Desktop fallback (full) */}
            <img
              src="/legendary-desktop.jpg"
              alt="Satoshi Flushimoto statue on toilet inside the legendary gas station stall"
              className="hero-img"
              loading="eager"
            />
          </picture>
        </div>
      </section>

      {/* Footer with contract placeholder */}
      <footer className="footer-chip">
        Contract: <span className="mono">So1aNaPUMPFUNCONTRACTADDR...</span>
      </footer>

      {/* Minimal modal */}
      {open && (
        <div className="modal-root">
          <div className="modal-backdrop" onClick={() => setOpen(null)} />
          <div className="modal-card">
            <div className="modal-title">
              {open === 'story' ? 'The Prophecy of Satoshi Flushimoto' : 'TOILETCOIN Wipepaper'}
            </div>
            <div>
              {open === 'story' ? <Story/> : <Wipepaper/>}
            </div>
            <button className="btn" onClick={() => setOpen(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

function Story() {
  return (
    <div className="copy">
      <p>It was past midnight on a dead-still highway. Satoshi Flushimoto — a washed-up trader with more liquidations than wins — hunted for relief when destiny (and indigestion) struck.</p>
      <p>He found a forgotten gas station, a grimy stall, and — mid-poop, straining — the revelation: if the market is a toilet, it needs a Final Flush. Right there, he deployed TOILETCOIN on Pump.fun, minted 1,000,000,000 supply, bought the first 1,000,000 as parody of Satoshi’s stash, scrawled the contract and crooked toilet logo on a tile (the Genesis Tile), jotted the Wipepaper on two-ply, and vanished into the night.</p>
      <p>Days later a janitor discovered the artifacts, posted them online, and the legend spread. The gas station owner built a statue over the sacred stall. Pilgrims now line up for the next-door stall, and his profits? ~6,900,000×. At least someone matched Bitcoin’s growth. Holders may settle for 69× — if fate (and the plumbing) allow.</p>
    </div>
  );
}

function Wipepaper() {
  return (
    <pre className="wipepaper">
TOILETCOIN — Wipepaper
Mission: Flush the market and clog the haters.
Supply: 1,000,000,000 (more zeros = more serious).
Utility: None whatsoever.
Roadmap: 🚽
Exit Strategy: Pull the handle.
Future Vision: You better hold — one day this will be the official currency for public bathrooms worldwide.
Parody Partnerships: Global Plumbing Committee, International Toilet Manufacturers, luxury 4-ply.
Environmental Claim: Carbon neutral, methane negative* (*trust the vibe).
Charity Meme: Adopt-A-Toilet (includes framed bowl NFT).
    </pre>
  );
}
