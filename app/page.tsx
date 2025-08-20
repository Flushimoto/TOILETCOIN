'use client';
import { useEffect, useState } from 'react';

const CONTRACT = 'So1aNaPUMPFUNCONTRACTADDR...'; // TODO: replace with real mint

export default function Page() {
  const [copied, setCopied] = useState(false);

  // Lock scroll ONLY on landing
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  function copyContract() {
    navigator.clipboard.writeText(CONTRACT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }).catch(() => {});
  }

  return (
    <main className="landing">
      {/* Full background */}
      <picture aria-hidden>
        <source media="(max-width: 640px)" srcSet="/hero-mobile.jpg" />
        <source media="(max-width: 1024px)" srcSet="/hero-tablet.jpg" />
        <img src="/hero-desktop.jpg" alt="" className="bg-img" />
      </picture>

      <div className="hero-center">
        <h1 className="display">The Final Flush</h1>
        <p className="sub">Born mid-poop by Satoshi Flushimoto. 1,000,000,000 supply. Utility: none. Lore: everything.</p>

        <div className="contract-card">
          <div className="contract-label">Contract</div>
          <button className="contract-value" onClick={copyContract} title="Click to copy">
            <span className="mono">{CONTRACT}</span>
          </button>
          <div className={`copied ${copied ? 'on' : ''}`}>Copied!</div>
        </div>

        <div className="hero-ctas">
          <a className="btn" href="/buy">Buy</a>
          <a className="btn ghost" href="/chart">Chart</a>
          <a className="btn ghost" href="/story">Story</a>
          <a className="btn ghost" href="/wipepaper">Wipepaper</a>
        </div>
      </div>
    </main>
  );
}
