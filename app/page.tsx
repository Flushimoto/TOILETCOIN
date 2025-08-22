'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | 'contact' | null;

const CONTRACT = 'So1aNaPUMPFUNCONTRACTADDR...';     // TODO: real contract
const WEB3FORMS_KEY = 'f8741ccf-8e2d-476e-920b-aac3c75eaf69'; // contact overlay key

declare global {
  interface Window { Jupiter?: { init?: (opts: any) => void } }
}

export default function Page() {
  const [open, setOpen] = useState<Panel>(null);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // ESC closes panel/menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(null); setMenuOpen(false); }
    };
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
      <div className="bg" aria-hidden />

      {/* Header */}
      <header className="topbar">
        {/* BRAND: logo only */}
          <Image
            src="/logo.png"
            alt="Toiletcoin Logo"
            width={160}
            height={48}
            priority
            className="brand-logo"
          />
        </div>

        <button
          className={`hamburger ${menuOpen ? 'on' : ''}`}
          aria-label="Menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <button className={`btn navbtn ${open === 'story' ? 'active' : ''}`} onClick={() => { setOpen('story'); setMenuOpen(false); }}>Story</button>
          <button className={`btn navbtn ${open === 'wipepaper' ? 'active' : ''}`} onClick={() => { setOpen('wipepaper'); setMenuOpen(false); }}>Wipepaper</button>
          <button className={`btn navbtn ${open === 'chart' ? 'active' : ''}`} onClick={() => { setOpen('chart'); setMenuOpen(false); }}>Chart</button>
          <button className={`btn navbtn ${open === 'contact' ? 'active' : ''}`} onClick={() => { setOpen('contact'); setMenuOpen(false); }}>Contact</button>
          <a className="btn navbtn" href="https://x.com/" target="_blank" rel="noreferrer">X</a>
          <a className="btn navbtn" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
        </nav>
      </header>

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

        <div className="cta-row">
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
                {open === 'contact' && 'Contact Us'}
              </h2>
              <button className="btn close" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            </div>

            <div className="panel-body">
              {open === 'story' && <Story />}
              {open === 'wipepaper' && <Wipepaper />}
              {open === 'chart' && <Chart />}
              {open === 'contact' && <ContactJSON accessKey={WEB3FORMS_KEY} />}
              {open === 'buy' && <BuyPlugin />}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Panels ---------- */

function Story() {
  return (
    <div className="copy">
      <p>Past midnight on a dead-still highway, Satoshi Flushimoto—more liquidations than wins—hunted for relief when destiny (and indigestion) struck.</p>
      <p>He found a forgotten gas station, a grimy stall, and—mid-poop, straining—the revelation: if the market is a toilet, it needs a Final Flush. He deployed <strong>TOILETCOIN</strong> on Pump.fun, minted <strong>1,000,000,000</strong>, bought the first <strong>1,000,000</strong>, scrawled the contract on a tile, wrote the Wipepaper on two-ply, and vanished.</p>
      <p>Days later a janitor posted the artifacts. The owner built a shrine. Pilgrims now queue for the next stall. Profits? ~<strong>6,900,000×</strong>.</p>
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

function Chart() {
  return (
    <div className="embed">
      <p className="muted">Live data from Dexscreener.</p>
      <div className="frame">
        <iframe title="Dexscreener" src="https://dexscreener.com/solana" loading="lazy" />
      </div>
    </div>
  );
}

/** CONTACT — Web3Forms JSON */
function ContactJSON({ accessKey }: { accessKey: string }) {
  const [result, setResult] = useState<string>('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setResult('Sending…');

    const form = e.currentTarget as HTMLFormElement;
    const body = {
      access_key: accessKey,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data?.success) { setResult('✅ Form Submitted Successfully'); form.reset(); }
      else { setResult(`❌ ${data?.message || 'Submission failed.'}`); }
    } catch {
      setResult('❌ Network error. Try again.');
    } finally { setSending(false); }
  }

  return (
    <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 520 }}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required placeholder="Satoshi Flushimoto" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required placeholder="Say hi, propose chaos, request a shrine…" rows={6} />
        </div>
        <div className="form-row">
          <button className="btn buy" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send Message'}</button>
          <a className="btn" href="mailto:contact@toiletcoin.wtf">Or email directly</a>
        </div>
        {result && <p className="form-error" style={{ marginTop: 8 }}>{result}</p>}
      </form>
    </div>
  );
}

/** BUY — Jupiter plugin v1 (integrated mode) */
function BuyPlugin() {
  useEffect(() => {
    if (window.Jupiter?.init) {
      window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'jup-target',
        branding: { name: 'TOILETCOIN SWAP' },
      });
    }
  }, []);

  return (
    <div className="embed">
      <p className="muted">Swap via Jupiter.</p>
      <div id="jup-target" style={{ width: '100%', maxWidth: 500, height: 600, margin: '0 auto' }} />
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
