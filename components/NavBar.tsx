'use client';

import { useEffect, useRef, useState } from 'react';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | 'contact';
export default function NavBar({ onOpen }: { onOpen?: (p: Panel) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click (mobile)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuOpen) return;
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  return (
    <div ref={wrapRef} className="topbar">
      {/* Left side empty (or add branding later) */}
      <div style={{ width: 1 }} />

      {/* Right side nav */}
      <button
        className={`hamburger ${menuOpen ? 'on' : ''}`}
        aria-label="Menu"
        onClick={() => setMenuOpen(v => !v)}
      >
        <span /><span /><span />
      </button>

      <nav className={`nav ${menuOpen ? 'open' : ''}`} style={{ marginLeft: 'auto' }}>
        <button className="btn navbtn" onClick={() => { onOpen?.('story'); setMenuOpen(false); }}>Story</button>
        <button className="btn navbtn" onClick={() => { onOpen?.('wipepaper'); setMenuOpen(false); }}>Wipepaper</button>
        <button className="btn navbtn" onClick={() => { onOpen?.('chart'); setMenuOpen(false); }}>Chart</button>
        <button className="btn navbtn" onClick={() => { onOpen?.('contact'); setMenuOpen(false); }}>Contact</button>
        <a className="btn navbtn" href="/bored" onClick={() => setMenuOpen(false)}>Bored?</a>
        <a className="btn navbtn" href="https://x.com/" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>X</a>
        <a className="btn navbtn" href="https://t.me/" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>TG</a>
      </nav>
    </div>
  );
}
