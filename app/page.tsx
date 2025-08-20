'use client';
import { useEffect, useState } from 'react';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | null;

const CONTRACT = 'So1aNaPUMPFUNCONTRACTADDR...'; // TODO: replace with real mint

export default function Page() {
  const [open, setOpen] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);

  // Lock scroll on entire app (landing only)
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC to close panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function copyContract() {
    navigator.clipboard.writeText(CONTRACT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }).catch(() => {});
  }

  return (
    <main className="screen">
      {/* Full-bleed background (no shade) */}
      <picture aria-hidden>
        <source media="(max-width: 640px)" srcSet="/hero-mobile.jpg" />
        <source media="(max-width: 1024px)" srcSet="/hero-tablet.jpg" />
        <img src="/hero-desktop.jpg" alt="" className="bg-img" />
      </picture>

      {/* Header / NAV */}
      <header className="topbar">
        <div className="brand">TOILETCOIN</div>
        <nav className="nav">
          <button
            className={`btn navbtn ${open === 'story' ? 'active' : ''}`}
            onClick={() => setOpen('story')}
          >
            Story
          </button>
          <button
            className={`btn navbtn ${open === 'wipepaper' ? 'active' : ''}`}
            onClick={() => setOpen('wipepaper')}
          >
            Wipepaper
          </button>
          <button
            className={`btn navbtn ${open === 'chart' ? 'active' : ''}`}
            onClick={() => setOpen('chart')}
          >
            Chart
          </button>
          <a className="btn navbtn" href="https://x.com/" target="_blank" rel="noreferrer">X</a>
          <a className="btn navbtn" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
        </nav>
      </header>

      {/* Center hero */}
      <section className="center">
        <h1 className="display">The Final Flush</h1>
        <p className="tag">
          Born mid-poop by Satoshi Flushimoto. 1,000,000,000 supply. Utility: none. Lore: everything.
        </p>

        {/* Contract — LARGE + copy on click */}
        <div className="contract">
          <div className="contract-label">Contract</div>
          <button className="contract-value" onClick={copyContract} title="Click to copy">
            <span className="mono">{CONTRACT}</span>
          </button>
          <div className={`copied ${copied ? 'on' : ''}`}>Copied!</div>
        </div>

        {/* Single, wide BUY button */}
        <div className="cta-row">
          <button className="btn primary wide" onClick={() => setOpen('buy')}>Buy Toiletcoin</button>
        </div>
      </section>

      {/* PANELS (overlays) */}
      {open && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="backdrop" onClick={() => setOpen(null)} />
          <div className="panel in">
            <div className="panel-head">
              <h2 className="panel-title">
                {open === 'story' && 'The Prophecy of Satoshi Flushimoto'}
                {open === 'wipepaper' && 'Wipepaper'}
                {open === 'buy' && 'Buy Toiletcoin'}
                {open === 'chart' && 'Chart'}
              </h2>
              <button className="btn close" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            </div>

            <div className="panel-body">
              {open === 'story' && <Story />}
              {open === 'wipepaper' && <Wipepaper />}
              {open === 'buy' && <Buy />}
              {open === 'chart' && <Chart />}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Story() {
  return (
    <div className="copy">
      <p>Past midnight on a dead-still highway, Satoshi Flushimoto—more liquidations than wins—hunted for relief when destiny (and indigestion) struck.</p>
      <p>He found a forgotten gas station, a grimy stall, and—mid-poop, straining—the revelation: if the market is a toilet, it needs a Final Flush. Right there he deployed <strong>TOILETCOIN</strong> on Pump.fun, minted <strong>1,000,000,000</strong> supply, bought the first <strong>1,000,000</strong> as a parody of Satoshi’s stash, scrawled the contract and crooked toilet logo on a tile (the Genesis Tile), jotted the Wipepaper on two-ply, and vanished into the night.</p>
      <p>Days later a janitor found the artifacts, posted them online, and the legend spread. The owner built a shrine over the sacred stall. Pilgrims now line up at the next-door stall; his profits? ~<strong>6,900,000×</strong>. At least someone matched Bitcoin’s growth.</p>
    </div>
  );
}

function Wipepaper() {
  return (
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
  );
}

function Buy() {
  return (
    <div className="embed">
      <p className="muted">Swap via Jupiter. Replace the mint in the URL once you have it.</p>
      <div className="frame">
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
  );
}

function Chart() {
  return (
    <div className="embed">
      <p className="muted">Live data from Dexscreener.</p>
      <div className="frame">
        {/* TODO: replace with your real Dexscreener pair URL when ready */}
        <iframe
          title="Dexscreener"
          src="https://dexscreener.com/solana"
          loading="lazy"
        />
      </div>
    </div>
  );
}
