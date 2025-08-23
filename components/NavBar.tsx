'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '../lib/config';

type Panel = 'story' | 'wipepaper' | 'buy' | 'chart' | 'contact';

export default function NavBar({ onOpen }: { onOpen: (p: Panel) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Click/tap outside closes menu
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!menuOpen) return;
      const t = e.target as Node;
      const outsideNav = navRef.current && !navRef.current.contains(t);
      const outsideBtn = menuBtnRef.current && !menuBtnRef.current.contains(t);
      if (outsideNav && outsideBtn) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuOpen]);

  return (
    <header className="topbar">
      <button
        ref={menuBtnRef}
        className={`hamburger ${menuOpen ? 'on' : ''}`}
        aria-label="Menu"
        onClick={() => setMenuOpen(v => !v)}
      >
        <span /><span /><span />
      </button>

      <nav ref={navRef} className={`nav ${menuOpen ? 'open' : ''}`} style={{ marginLeft: 'auto' }}>
        <button className="btn navbtn" onClick={() => { onOpen('story'); setMenuOpen(false); }}>Story</button>
        <button className="btn navbtn" onClick={() => { onOpen('wipepaper'); setMenuOpen(false); }}>Wipepaper</button>
        <button className="btn navbtn" onClick={() => { onOpen('chart'); setMenuOpen(false); }}>Chart</button>
        <button className="btn navbtn" onClick={() => { onOpen('contact'); setMenuOpen(false); }}>Contact</button>
        <button className="btn navbtn" onClick={() => onOpen?.('boring')}>Boring?</button>
        <a className="btn navbtn" href={SITE.socials.x} target="_blank" rel="noreferrer">X</a>
        <a className="btn navbtn" href={SITE.socials.tg} target="_blank" rel="noreferrer">TG</a>
      </nav>
    </header>
  );
}
