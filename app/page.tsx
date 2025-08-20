// TOILETCOIN — Minimal, meme-serious website
// Updated: removed background shade overlay

import Image from 'next/image'
import NavBar from '../components/NavBar'

export default function Page(){
  return (
    <main className="relative min-h-screen w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-bathroom" aria-hidden />

      <NavBar />

      {/* Center statue on toilet with responsive images */}
      <section className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm shadow-soft">
          <Image
            src="/statue-desktop.jpg"
            alt="Satoshi Flushimoto statue on toilet"
            width={1920}
            height={1080}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            srcSet="
              /statue-mobile.jpg 640w,
              /statue-tablet.jpg 1024w,
              /statue-desktop.jpg 1920w
            "
            className="h-auto w-[75vw] max-w-[680px]"
          />
        </div>
      </section>

      {/* Subtle footer with contract placeholder */}
      <footer className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center pb-4">
        <div className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 border border-white/10">
          Contract: <span className="font-mono">So1aNaPUMPFUNCONTRACTADDR...</span>
        </div>
      </footer>
    </main>
  )
}
