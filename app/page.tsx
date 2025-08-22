'use client';

import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Overlay from '../components/Overlay';
import PanelStory from '../components/PanelStory';
import PanelWipepaper from '../components/PanelWipepaper';
import PanelChart from '../components/PanelChart';
import PanelContact from '../components/PanelContact';
import PanelBuy from '../components/PanelBuy';
import { SITE } from '../lib/config';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | 'contact' | null;

export default function Page() {
  const [open, setOpen] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);

  // Keep single-screen (no page scroll)
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

  // --- Deep linking: read ?panel=... from URL on load and when back/forward is used
  useEffect(() => {
    function syncFromUrl() {
      try {
        const params = new URLSearchParams(window.location.search);
        const p = (params.get('panel') || '').toLowerCase();
        if (['story','wipepaper','buy','chart','contact'].includes(p)) {
          setOpen(p as Exclude<Panel, null>);
        } else {
          setOpen(null);
        }
      } catch {
        setOpen(null);
      }
    }
    // initial
    syncFromUrl();
    // back/forward
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  function setUrlPanel(p: Panel) {
    const url = new URL(window.location.href);
    if (p) url.searchParams.set('panel', p);
    else url.searchParams.delete('panel');
    window.history.replaceState({}, '', url.toString());
  }

  function openPanel(p: Exclude<Panel, null>) {
    setOpen(p);
    setUrlPanel(p);
  }
  function closePanel() {
    setOpen(null);
    setUrlPanel(null);
  }

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

      {/* Nav (right-aligned; mobile menu handled inside) */}
      <NavBar onOpen={(p) => openPanel(p)} />

      {/* Hero */}
      <section className="center">
        <h1 className="display">The Final Flush</h1>
        <p className="tag">
          Born mid-poop by Satoshi Flushimoto. 1,000,000,000 supply. Utility: none. Lore: everything.
        </p>

        <div className="contract">
          <div className="contract-label">Contract</div>
          <button className="contract-value" onClick={copyContract} title="Click to copy">
            <span className="mono">{SITE.contract}</span>
          </button>
          <div className={`copied ${copied ? 'on' : ''}`}>Copied!</div>
        </div>

        <div className="cta-row">
          <button className="btn buy wide" onClick={() => openPanel('buy')}>
            Buy Toiletcoin
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footnote">
          © 2025 {SITE.domain} ·{' '}
          <button className="linklike" onClick={() => openPanel('contact')}>
            contact@{SITE.domain}
          </button>
        </p>
      </footer>

      {/* Overlays (URL-synced) */}
      {open === 'story' && (
        <Overlay title="The Prophecy of Satoshi Flushimoto" onClose={closePanel}>
          <PanelStory />
        </Overlay>
      )}
      {open === 'wipepaper' && (
        <Overlay title="Wipepaper" onClose={closePanel}>
          <PanelWipepaper />
        </Overlay>
      )}
      {open === 'chart' && (
        <Overlay title="Chart" onClose={closePanel}>
          <PanelChart />
        </Overlay>
      )}
      {open === 'contact' && (
        <Overlay title="Contact Us" onClose={closePanel}>
          <PanelContact />
        </Overlay>
      )}
      {open === 'buy' && (
        <Overlay title="Buy Toiletcoin" onClose={closePanel}>
          <PanelBuy />
        </Overlay>
      )}
    </main>
  );
}
