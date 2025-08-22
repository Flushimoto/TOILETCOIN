'use client';

export default function Overlay({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="backdrop" onClick={onClose} />
      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">{title}</h2>
          <button className="btn close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="panel-body">{children}</div>
      </div>
    </div>
  );
}
