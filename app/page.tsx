'use client';

import { useEffect, useState } from 'react';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | null;

const CONTRACT = 'So1aNaPUMPFUNCONTRACTADDR...';   // TODO: replace with the real mint/contract
const OUTPUT_MINT = '<YOUR_MINT_ADDRESS>';         // TODO: replace with your token mint for Jupiter

declare global {
  interface Window {
    Jupiter?: {
      init?: (opts: any) => void;
    };
  }
}

export default function Page() {
  const [open, setOpen] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock page scroll globally (single-screen layout)
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  // ESC to close panel or mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function copyContract() {
    navigator.clipboard
      .writeText(CONTRACT)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      })
      .catch(() => {});
  }

  return (
    <main className="screen">
      {/* Full-screen CSS background (set in globals.css via .bg) */}
      <div className="bg" aria-hidden />

      {/* Header */}
      <header className="topbar">
        <div className="brand">TOILETCOIN</div>

        <button
          className={`hamburger ${menuOpen ? 'on' : ''}`}
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <button
            className={`btn navbtn ${open === 'story' ? 'active' : ''}`}
            onClick={() => {
              setOpen('story');
              setMenuOpen(false);
            }}
          >
            Story
          </button>
          <button
            className={`btn navbtn ${open === 'wipepaper' ? 'active' : ''}`}
            onClick={() => {
              setOpen('wipepaper');
              setMenuOpen(false);
            }}
          >
            Wipepaper
          </button>
          <button
            className={`btn navbtn ${open === 'chart' ? 'active' : ''}`}
            onClick={() => {
              setOpen('chart');
              setMenuOpen(false);
            }}
          >
            Chart
          </button>
          <a className="btn navbtn" href="https://x.com/" target="_blank" rel="noreferrer">
            X
          </a>
          <a className="btn navbtn" href="https://t.me/" target="_blank" rel="noreferrer">
            TG
          </a>
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

        {/* ✅ Single, wide BUY button (GREEN) */}
        <div className="cta-row">
          <button className="btn buy wide" onClick={() => setOpen('buy')}>
            Buy Toiletcoin
          </button>
        </div>
      </section>

      {/* Overlays */}
      {open && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="backdrop" onClick={() => setOpen(null)} />
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">
                {open === 'story' && 'The Prophecy of Satoshi Flushimoto'}
                {open === 'wipepaper' && 'Wipepaper'}
                {open === 'buy' && 'Buy Toiletcoin'}
                {open === 'chart' && 'Chart'}
              </h2>
              <button className="btn close" onClick={() => setOpen(null)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="panel-body">
              {open === 'story' && <Story />}
              {open === 'wipepaper' && <Wipepaper />}
              {open === 'buy' && <Buy outputMint={OUTPUT_MINT} />}
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
      <p>
        Past midnight on a dead-still highway, Satoshi Flushimoto—more liquidations than wins—hunted for
        relief when destiny (and indigestion) struck.
      </p>
      <p>
        He found a forgotten gas station, a grimy stall, and—mid-poop, straining—the revelation: if the market is a toilet, it needs a Final Flush. Right there he deployed <strong>TOILETCOIN</strong> on Pump.fun, minted{' '}
        <strong>1,000,000,000</strong> supply, bought the first <strong>1,000,000</strong> as a parody of
        Satoshi’s stash, scrawled the contract and crooked toilet logo on a tile (the Genesis Tile), jotted the
        Wipepaper on two-ply, and vanished into the night.
      </p>
      <p>
        Days later a janitor found the artifacts, posted them online, and the legend spread. The owner built a
        shrine over the sacred stall. Pilgrims now line up at the next-door stall; his profits? ~<strong>6,900,000×</strong>. At least someone matched Bitcoin’s growth.
      </p>
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
Partnership Lore: international plumbers, toilet &amp; TP industry (parody).
Environment: carbon neutral, methane negative* (*trust the vibe).
Charity Meme: Adopt-A-Toilet (includes framed bowl NFT).
    </pre>
  );
}

/** BUY — Jupiter Terminal via official snippet */
function Buy({ outputMint }: { outputMint: string }) {
  useEffect(() => {
    const init = () => {
      if (window.Jupiter && typeof window.Jupiter.init === 'function') {
        window.Jupiter.init({
          container: document.getElementById('jup-widget'),
          endpoint: 'https://api.mainnet-beta.solana.com',
          formProps: {
            fixedOutputMint: !!outputMint,
            fixedInputMint: false,
            initialOutputMint: outputMint || undefined,
          },
          defaultExplorer: 'Solscan',
          strictTokenList: false,
        });
      }
    };

    // load once
    if (!window.Jupiter) {
      const s = document.createElement('script');
      s.src = 'https://terminal.jup.ag/main-v2.js';
      s.async = true;
      s.onload = init;
      document.body.appendChild(s);
      return () => { /* keep terminal for next open */ };
    } else {
      init();
      return () => { /* keep terminal for next open */ };
    }
  }, [outputMint]);

  return (
    <div className="embed">
      <p className="muted">Swap via Jupiter Terminal.</p>
      <div id="jup-widget" className="terminal" />
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
        {/* TODO: replace with your actual pair URL when live */}
        <iframe title="Dexscreener" src="https://dexscreener.com/solana" loading="lazy" />
      </div>
    </div>
  );
}
