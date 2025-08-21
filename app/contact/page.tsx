'use client';

import { useState } from 'react';
import Link from 'next/link';

const WEB3FORMS_KEY = 'f8741ccf-8e2d-476e-920b-aac3c75eaf69';

export default function ContactPage() {
  const [result, setResult] = useState<string>('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setResult('Sending…');

    const form = e.currentTarget as HTMLFormElement;

    const body = {
      access_key: WEB3FORMS_KEY,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.success) {
        setResult('✅ Form Submitted Successfully');
        form.reset();
      } else {
        setResult(`❌ ${data?.message || 'Submission failed.'}`);
      }
    } catch {
      setResult('❌ Network error. Try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="screen">
      <div className="bg" aria-hidden />

      <section className="center" style={{ textAlign: 'left' }}>
        <h1 className="display" style={{ fontSize: 'clamp(28px,4.8vw,52px)' }}>Contact Us</h1>
        <p className="tag">Questions, partnerships, shrines, or plumbing lore—drop a message.</p>

        <div style={{ width: '100%', display: 'grid', placeItems: 'center', marginTop: 12 }}>
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
              <Link className="btn" href="/">Back</Link>
            </div>

            {result && <p className="form-error" style={{ marginTop: 8 }}>{result}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
