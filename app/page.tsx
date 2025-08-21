'use client';

import { useEffect, useState } from 'react';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | 'contact' | null;

const CONTRACT = 'So1aNaPUMPFUNCONTRACTADDR...';     // TODO: real mint
const OUTPUT_MINT = '<YOUR_MINT_ADDRESS>';           // TODO: for Jupiter widget
const FORMSPREE_ID = '<YOUR_FORMSPREE_ID>';          // e.g. "mxyzabcd" from https://formspree.io

declare global {
  interface Window {
    Jupiter?: { init?: (opts: any) => void };
  }
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
      if (e.key === 'Escape') {
        setOpen(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function copyContract() {
    navigator.clipboard.writeText(CONTRACT)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      })
      .catch(() => {});
  }

  return (
    <main className="screen">
      {/* Background (set in globals.css via .bg) */}
      <div className="bg" aria-hidden />

      {/* Header */}
      <header className="topbar">
        <div className="brand">TOILETCOIN</div>

        <button
          className={`hamburger ${menuOpen ? 'on' : ''}`}
          aria-label="Menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <button
            className={`btn navbtn ${open === 'story' ? 'active' : ''}`}
            onClick={() => { setOpen('story'); setMenuOpen(false); }}
          >
            Story
          </button>
          <button
            className={`btn navbtn ${open === 'wipepaper' ? 'active' : ''}`}
            onClick={() => { setOpen('wipepaper'); setMenuOpen(false); }}
          >
            Wipepaper
          </button>
          <button
            className={`btn navbtn ${open === 'chart' ? 'active' : ''}`}
            onClick={() => { setOpen('chart'); setMenuOpen(false); }}
          >
            Chart
          </button>
          <button
            className={`btn navbtn ${open === 'contact' ? 'active' : ''}`}
            onClick={() => { setOpen('contact'); setMenuOpen(false); }}
          >
            Contact
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

        {/* Buy CTA — green */}
        <div className="cta-row">
          <button className="btn buy wide" onClick={() => setOpen('buy')}>Buy Toiletcoin</button>
        </div>
      </section>

      {/* Footer (branding + email) */}
      <footer className="footer">
        <p className="footnote">© 2025 toiletcoin.wtf · <a href="mailto:contact@toiletcoin.wtf">contact@toiletcoin.wtf</a></p>
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
              {open === 'buy' && <Buy outputMint={OUTPUT_MINT} />}
              {open === 'chart' && <Chart />}
              {open === 'contact' && <Contact formId={FORMSPREE_ID} />}
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
    if (!window.Jupiter) {
      const s = document.createElement('script');
      s.src = 'https://terminal.jup.ag/main-v2.js';
      s.async = true;
      s.onload = init;
      document.body.appendChild(s);
      return () => {};
    } else {
      init();
      return () => {};
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
        <iframe title="Dexscreener" src="https://dexscreener.com/solana" loading="lazy" />
      </div>
    </div>
  );
}

/** CONTACT — static-friendly form to Formspree */
function Contact({ formId }: { formId: string }) {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        setErr(json?.errors?.[0]?.message || 'Failed to send. Try again later.');
      }
    } catch (e) {
      setErr('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="form success">
        <p>Thanks! Your message has been sent.</p>
        <p>We’ll get back to you at the email you provided.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* Honeypot for bots */}
      <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" />

      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required placeholder="Satoshi Flushimoto" />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="_replyto" type="email" required placeholder="you@example.com" />
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required placeholder="Say hi, propose chaos, request a shrine…" rows={6} />
      </div>

      {/* Direct email route if Formspree fails */}
      <input type="hidden" name="_subject" value="Toiletcoin Contact" />
      <input type="hidden" name="_template" value="table" />

      <div className="form-row">
        <button className="btn buy" type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send Message'}
        </button>
        <a className="btn" href="mailto:contact@toiletcoin.wtf">Or email directly</a>
      </div>

      {err && <p className="form-error">{err}</p>}
    </form>
  );
}
