import './globals.css';
import type { Metadata } from 'next';
import { SITE } from '../lib/config';

export const metadata: Metadata = {
  title: `${SITE.name} — The Final Flush`,
  description: 'Born mid-poop by Satoshi Flushimoto. Utility: none. Lore: everything.',
  metadataBase: new URL(`https://${SITE.domain}`),
  openGraph: {
    title: `${SITE.name} — The Final Flush`,
    description: 'Born mid-poop by Satoshi Flushimoto. Utility: none. Lore: everything.',
    url: `https://${SITE.domain}`,
    siteName: SITE.name,
    images: ['/open-graph.png'], // add later if you want
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — The Final Flush`,
    description: 'Born mid-poop by Satoshi Flushimoto.',
    images: ['/open-graph.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://terminal.jup.ag" />
        {/* Jupiter Terminal script (v2) */}
        <script defer src="https://terminal.jup.ag/main-v2.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
