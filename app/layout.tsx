// app/layout.tsx
import './globals.css'
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Jupiter plugin v1 — load once for the whole app */}
        <Script
          src="https://plugin.jup.ag/plugin-v1.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
