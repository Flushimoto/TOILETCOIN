'use client';

import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Overlay from '../components/Overlay';
import PanelStory from '../components/PanelStory';
import PanelWipepaper from '../components/PanelWipepaper';
import PanelChart from '../components/PanelChart';
import PanelContact from '../components/PanelContact';
import PanelBuy from '../components/PanelBuy';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | 'contact' | null;

const CONTRACT = 'So1aNaPUMPFUNCONTRACTADDR...'; // put real one when ready

export default function Page() {
  const [open, setOpen] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);

  // lock single-screen
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prevHtml; document.body.style.overflow = prevBody; };
  }, []);

  // ESC closes panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function copyContract() {
    navigator.clipboard.writeText(CONTRACT).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1200);
    }).catch(() => {});
  }

  return (
    <main className="screen">
      {/* Background (responsive via CSS) */}
      <div className="bg" aria-hidden />

      <NavBar onOpen={setOpen} />

      {/* Hero */}
      <section className="center">
        <h1 className="display">The Final Flush</h1>
        <p className="tag">Born mid-poop by Satoshi Flushimoto. 1,000,000,000 supply. Utility: none. Lore: everything.</p>

        <div className="contract">
          <div className="contract-label">Contract</div>
          <button className="contract-value" onClick={copyContract} title="Click to copy">
            <span className="mono">{CONTRACT}</span>
          </button>
          <div className={`copied ${copied ? 'on' : ''}`}>Copied!</div>
        </div>

        <div className="cta-row" style={{ marginTop: 14 }}>
          <button className="btn buy wide" onClick={() => setOpen('buy')}>Buy Toiletcoin</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footnote">
          © 2025 toiletcoin.wtf ·{' '}
          <button className="linklike" onClick={() => setOpen('contact')}>contact@toiletcoin.wtf</button>
        </p>
      </footer>

      {/* Panels */}
      {open === 'story' && (
        <Overlay title="The Prophecy of Satoshi Flushimoto" onClose={() => setOpen(null)}>
          <PanelStory />
        </Overlay>
      )}
      {open === 'wipepaper' && (
        <Overlay title="Wipepaper" onClose={() => setOpen(null)}>
          <PanelWipepaper />
        </Overlay>
      )}
      {open === 'chart' && (
        <Overlay title="Chart" onClose={() => setOpen(null)}>
          <PanelChart />
        </Overlay>
      )}
      {open === 'contact' && (
        <Overlay title="Contact Us" onClose={() => setOpen(null)}>
          <PanelContact />
        </Overlay>
      )}
      {open === 'buy' && (
        <Overlay title="Buy Toiletcoin" onClose={() => setOpen(null)}>
          <PanelBuy />
        </Overlay>
      )}
    </main>
  );
}
