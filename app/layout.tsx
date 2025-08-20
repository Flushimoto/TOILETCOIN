import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TOILETCOIN',
  description: 'The Final Flush — born mid-poop by Satoshi Flushimoto. Utility: none.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">TOILETCOIN</Link>
            <nav className="nav">
              <Link className="btn ghost" href="/story">Story</Link>
              <Link className="btn ghost" href="/wipepaper">Wipepaper</Link>
              <Link className="btn" href="/buy">Buy</Link>
              <Link className="btn ghost" href="/chart">Chart</Link>
              <a className="btn ghost" href="https://x.com/" target="_blank" rel="noreferrer">X</a>
              <a className="btn ghost" href="https://t.me/" target="_blank" rel="noreferrer">TG</a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container foot">
            <div>© {new Date().getFullYear()} TOILETCOIN — satire, lore, community.</div>
            <div className="small">Not financial advice.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
