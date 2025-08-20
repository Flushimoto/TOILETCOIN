import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TOILETCOIN',
  description: 'The Final Flush — a satirical meme coin with myth-level lore.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
