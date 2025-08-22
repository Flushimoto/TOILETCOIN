'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // 👈 import

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | 'contact' | null;

export default function Page() {
  const [open, setOpen] = useState<Panel>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchParams = useSearchParams(); // 👈

  // On load: check ?panel=...
  useEffect(() => {
    const panel = searchParams.get('panel');
    if (panel === 'story' || panel === 'wipepaper' || panel === 'buy' || panel === 'chart' || panel === 'contact') {
      setOpen(panel);
    }
  }, [searchParams]);

  // Lock single-screen layout
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

  // ESC closes overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function copyContract() {
    navigator.clipboard.writeText(SITE.contract).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }).catch(() => {});
  }

  return (
    <main className="screen">
      {/* Background */}
      <div className="bg" aria-hidden />

      {/* Nav (no logo) */}
      <NavBar onOpen={(p) => setOpen(p)} />

      {/* Hero */}
      <section className="center">
        <h1 className="display">The Final Flush</h1>
        <p className="tag">Born mid-poop by Satoshi Flushimoto. 1,000,000,000 supply. Utility: none. Lore: everything.</p>

        <div className="contract">
          <div className="contract-label">Contract</div>
          <button className="contract-value" onClick={copyContract} title="Click to copy">
            <span className="mono">{SITE.contract}</span>
          </button>
          <div className={`copied ${copied ? 'on' : ''}`}>Copied!</div>
        </div>

        <div className="cta-row">
          <button className="btn buy wide" onClick={() => setOpen('buy')}>Buy Toiletcoin</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footnote">
          © 2025 {SITE.domain} ·{' '}
          <button className="linklike" onClick={() => setOpen('contact')}>contact@{SITE.domain}</button>
        </p>
      </footer>

      {/* Overlays */}
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
