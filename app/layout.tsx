import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TOILETCOIN',
  description: 'The Final Flush. Born mid-poop by Satoshi Flushimoto. 1B supply. Utility: none.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
