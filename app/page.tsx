'use client';

export default function Page() {
  return (
    <main className="root">
      {/* Background image (full-screen) */}
      <div className="bg">
        <img
          src="/legendary-desktop.jpg"
          alt="Flushimoto scene in the legendary gas-station bathroom"
          className="bg-img"
        />
      </div>

      {/* Optional dark wash so UI/text pop */}
      <div className="wash" aria-hidden />

      {/* Temporary center content just to verify deploy */}
      <section className="center">
        <h1 className="title">TOILETCOIN</h1>
        <p className="subtitle">Legendary Bathroom — test background live</p>
      </section>
    </main>
  );
}

