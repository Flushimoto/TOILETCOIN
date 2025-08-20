'use client';
import { useEffect, useState } from 'react';

type ModalKey = 'story' | 'wipepaper' | null;

export default function Page() {
  const [open, setOpen] = useState<ModalKey>(null);

  // ESC closes modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="root">
      {/* Background image */}
      <div className="bg">
        <img
          src="/legendary-desktop.jpg"
          alt="Flushimoto scene in the legendary gas-station bathroom"
          className="bg-img"
        />
      </div>

      {/* Soft dark wash */}
      <div className="wash" aria-hidden />

      {/* Top-right menu */}
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

      {/* Footer with contract placeholder */}
      <footer className="footer-chip">
        Contract: <span className="mono">So1aNaPUMPFUNCONTRACTADDR...</span>
      </footer>

      {/* Modals */}
      {open && (
        <div className="modal-root" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setOpen(null)} />
          <div className="modal-card">
            <div className="modal-title">
              {open === 'story' ? 'The Prophecy of Satoshi Flushimoto' : 'TOILETCOIN Wipepaper'}
            </div>
            <div className="copy">
              {open === 'story' ? <Story /> : <Wipepaper />}
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
    <>
      <p>Past midnight on a dead-still highway, Satoshi Flushimoto — a trader with more liquidations than wins — hunted for relief when destiny (and indigestion) struck.</p>
      <p>He found a forgotten gas station, a grimy stall, and — mid-poop, straining — the revelation: if the market is a toilet, it needs a Final Flush. Right there he deployed TOILETCOIN on Pump.fun, minted 1,000,000,000 supply, bought the first 1,000,000 as a parody of Satoshi’s stash, scrawled the contract and crooked toilet logo on a tile (the Genesis Tile), jotted the Wipepaper on two-ply, and vanished into the night.</p>
      <p>Days later a janitor found the artifacts, posted them online, and the legend spread. The owner built a statue over the sacred stall. Pilgrims now line up at the next-door stall; his profits? ~6,900,000×. At least someone matched Bitcoin’s growth. Holders may settle for 69× — if fate (and the plumbing) allow.</p>
    </>
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
Future Vision: You better hold — one day this will be accepted at public bathrooms worldwide.
Parody Partnerships: Global Plumbing Committee, Toilet & TP industry.
Environmental Claim: Carbon neutral, methane negative* (*trust the vibe).
Charity Meme: Adopt-A-Toilet (includes framed bowl NFT).
    </pre>
  );
}
