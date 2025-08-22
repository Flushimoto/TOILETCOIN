export default function PanelChart() {
  return (
    <div className="embed">
      <p className="muted">Live data from Dexscreener.</p>
      <div className="frame">
        <iframe title="Dexscreener" src="https://dexscreener.com/solana" loading="lazy" />
      </div>
    </div>
  );
}
