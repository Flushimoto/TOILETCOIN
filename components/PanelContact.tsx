'use client';

import { useState } from 'react';
import { SITE } from '../lib/config';

export default function PanelContact() {
  const [result, setResult] = useState<string>('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setResult('Sending…');

    const form = e.currentTarget as HTMLFormElement;
    const body = {
      access_key: SITE.web3formsKey,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data?.success) { setResult('✅ Form Submitted Successfully'); form.reset(); }
      else { setResult(`❌ ${data?.message || 'Submission failed.'}`); }
    } catch {
      setResult('❌ Network error. Try again.');
    } finally { setSending(false); }
  }

  return (
    <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 520 }}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required placeholder="Satoshi Flushimoto" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required placeholder="Say hi, propose chaos, request a shrine…" rows={6} />
        </div>
        <div className="form-row">
          <button className="btn buy" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send Message'}
          </button>
          <a className="btn" href="mailto:contact@toiletcoin.wtf">Or email directly</a>
        </div>
        {result && <p className="form-error" style={{ marginTop: 8 }}>{result}</p>}
      </form>
    </div>
  );
}
