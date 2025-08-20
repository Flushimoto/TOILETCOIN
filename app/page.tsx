'use client';
import { useEffect, useRef, useState } from 'react';

type ModalKey = 'story' | 'wipepaper' | null;

export default function Page() {
  const [open, setOpen] = useState<ModalKey>(null);
  const [flushing, setFlushing] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function triggerFlush() {
    setFlushing(false);
    requestAnimationFrame(() => setFlushing(true));
    setTimeout(() => setFlushing(false), 1100);
  }

  return (
    <main className="site">
      {/* CSS-only tile walls + grime (no images) */}
      <div className="tiles" aria-hidden />
      <div className="grime" aria-hidden />

      {/* Top-right nav */}
      <div className="nav-wrap">
        <nav className="nav">
          <button className="link" onClick={() => setOpen('story')}>Story</button>
          <button className="link" onClick={() => setOpen('wipepaper')}>Wipepaper</button>
          <a className="link strong" href="https://pump.fun/" target="_blank" rel="noreferrer">Buy</a>
          <a className="link" href="https://dexscreener.com/" target="_blank" rel="noreferrer">Chart</a>
          <a className="link" href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">X</a>
          <a className="link" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
        </nav>
      </div>

      {/* Hero: Flushimoto shrine (pure SVG) */}
      <section className="hero">
        <div className="plinth">
          <FlushimotoSVG />
          <h1 className="brand">TOILETCOIN</h1>
          <p className="tag">The Final Flush — parody coin for degens who can take a joke.</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="https://pump.fun/" target="_blank" rel="noreferrer">Buy on Pump.fun</a>
            <button className="btn" onClick={triggerFlush} aria-label="Flush">Flush</button>
          </div>
        </div>

        {/* Flush ring effect */}
        <div ref={ringRef} className={`flush-ring ${flushing ? 'on' : ''}`} aria-hidden />
      </section>

      {/* Footer */}
      <footer className="footer">
        Contract: <span className="mono">So1aNaPUMPFUNCONTRACTADDR...</span>
      </footer>

      {/* Modals */}
      {open && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="backdrop" onClick={() => setOpen(null)} />
          <div className="card">
            <h2 className="card-title">{open === 'story' ? 'The Prophecy of Satoshi Flushimoto' : 'TOILECOIN Wipepaper'}</h2>
            <div className="card-body">
              {open === 'story' ? <Story/> : <Wipepaper/>}
            </div>
            <button className="btn" onClick={() => setOpen(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

/** Stylized “statue”: hood + shiny plunger head + toilet outline — pure SVG, no assets */
function FlushimotoSVG() {
  return (
    <svg className="flushimoto" viewBox="0 0 220 220" role="img" aria-label="Satoshi Flushimoto bust">
      {/* Bronze hood */}
      <defs>
        <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7b5a38"/>
          <stop offset="50%" stopColor="#a87949"/>
          <stop offset="100%" stopColor="#6a4b32"/>
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffef9a"/>
          <stop offset="40%" stopColor="#ffd24a"/>
          <stop offset="100%" stopColor="#c7921f"/>
        </linearGradient>
      </defs>

      {/* Hood shape */}
      <path d="M30,150 C30,90 70,40 110,40 C150,40 190,90 190,150 L170,170 L50,170 Z" fill="url(#bronze)" />

      {/* Plunger head (golden cup) */}
      <ellipse cx="110" cy="95" rx="28" ry="20" fill="url(#gold)"/>
      {/* Plunger handle disappearing into hood */}
      <rect x="105" y="95" width="10" height="38" rx="3" fill="url(#gold)"/>

      {/* Minimal toilet outline below (line art) */}
      <path d="M85,170 h50 v10 q0,10 -25,10 q-25,0 -25,-10z" fill="#d9d9d9"/>
      <rect x="95" y="150" width="30" height="18" rx="3" fill="#e9e9e9" stroke="#cfcfcf" />
    </svg>
  );
}

function Story() {
  return (
    <>
      <p>Past midnight on a dead-still highway, Satoshi Flushimoto—more liquidations than wins—hunted for relief when destiny (and indigestion) struck.</p>
      <p>He found a forgotten gas station, a grimy stall, and—mid-poop, straining—the revelation: if the market is a toilet, it needs a Final Flush. Right there he deployed TOILETCOIN on Pump.fun, minted 1,000,000,000 supply, bought the first 1,000,000 as a parody of Satoshi’s stash, scrawled the contract and crooked toilet logo on a tile (the Genesis Tile), jotted the Wipepaper on two-ply, and vanished into the night.</p>
      <p>Days later a janitor found the artifacts, posted them online, and the legend spread. The owner built a shrine over the sacred stall. Pilgrims line up at the next stall; his profits? ~6,900,000×. At least someone matched Bitcoin’s growth. Holders may settle for 69×—if fate (and the plumbing) allow.</p>
    </>
  );
}

function Wipepaper() {
  return (
    <pre className="wipepaper">
TOILETCOIN — Wipepaper
Mission: Flush the market and clog the haters.
Supply: 1,000,000,000 (serious zeros).
Utility: none whatsoever.
Roadmap: 🚽
Exit Strategy: pull the handle.
Future Vision: you better hold — one day this will be accepted at public bathrooms worldwide.
Partnership Lore: international plumbers, toilet & TP industry (parody).
Environment: carbon neutral, methane negative* (*trust the vibe).
Charity Meme: Adopt-A-Toilet (includes framed bowl NFT).
    </pre>
  );
}
