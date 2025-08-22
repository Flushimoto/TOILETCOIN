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
  const [bestScore, setBestScore] = useState<number | null>(null);

  // lock single-screen
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prevHtml; document.body.style.overflow = prevBody; };
  }, []);

  // deep-link
  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const p = (params.get('panel') || '').toLowerCase();
      if (['story','wipepaper','buy','chart','contact'].includes(p)) setOpen(p as any);
      else setOpen(null);
    }
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // load best game score (if any)
  useEffect(() => {
    const s = Number(localStorage.getItem('toiletcoin_best') || '0');
    if (!Number.isNaN(s) && s > 0) setBestScore(s);
  }, []);

  function setUrlPanel(p: Panel) {
    const url = new URL(window.location.href);
    if (p) url.searchParams.set('panel', p);
    else url.searchParams.delete('panel');
    window.history.replaceState({}, '', url.toString());
  }
  function openPanel(p: Exclude<Panel, null>) { setOpen(p); setUrlPanel(p); }
  function closePanel() { setOpen(null); setUrlPanel(null); }

  function copyContract() {
    navigator.clipboard.writeText(SITE.contract).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1200);
    }).catch(() => {});
  }

  return (
    <main className="screen">
      <div className="bg" aria-hidden />

      <NavBar onOpen={(p) => openPanel(p)} />

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

        <div className="cta-row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <button className="btn buy wide" onClick={() => openPanel('buy')}>Buy Toiletcoin</button>
          {bestScore !== null && (
            <div className="btn" style={{ cursor: 'default' }}>
              Best Game Score: <strong style={{ marginLeft: 6 }}>{bestScore}</strong>
            </div>
          )}
          <a className="btn" href="/boring">Play “Flush the Shitcoins”</a>
        </div>
      </section>

      <footer className="footer">
        <p className="footnote">
          © 2025 {SITE.domain} ·{' '}
          <button className="linklike" onClick={() => openPanel('contact')}>contact@{SITE.domain}</button>
        </p>
      </footer>

      {open === 'story' && (
        <Overlay title="The Prophecy of Satoshi Flushimoto" onClose={closePanel}><PanelStory /></Overlay>
      )}
      {open === 'wipepaper' && (
        <Overlay title="Wipepaper" onClose={closePanel}><PanelWipepaper /></Overlay>
      )}
      {open === 'chart' && (
        <Overlay title="Chart" onClose={closePanel}><PanelChart /></Overlay>
      )}
      {open === 'contact' && (
        <Overlay title="Contact Us" onClose={closePanel}><PanelContact /></Overlay>
      )}
      {open === 'buy' && (
        <Overlay title="Buy Toiletcoin" onClose={closePanel}><PanelBuy /></Overlay>
      )}
    </main>
  );
}
