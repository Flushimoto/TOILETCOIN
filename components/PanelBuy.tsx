'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Jupiter?: { init?: (opts: any) => void };
  }
}

export default function PanelBuy() {
  useEffect(() => {
    // If script not yet ready, just wait; layout.tsx loads it with defer
    const i = setInterval(() => {
      if (window.Jupiter?.init) {
        window.Jupiter.init({
          displayMode: 'integrated',
          integratedTargetId: 'jup-target',
          branding: { name: 'TOILETCOIN SWAP' },
        });
        clearInterval(i);
      }
    }, 150);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="embed">
      <p className="muted">Swap via Jupiter.</p>
      <div id="jup-target" style={{ width: '100%', maxWidth: 500, height: 600, margin: '0 auto' }} />
    </div>
  );
}
