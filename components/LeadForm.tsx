'use client';
import { useState } from 'react';

export default function LeadForm({ service, location, dark = false, compact = false }: {
  service?: string; location?: string; dark?: boolean; compact?: boolean;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'), phone: fd.get('phone'), postcode: fd.get('postcode'),
        message: fd.get('message'), service, location, page: window.location.pathname,
      }),
    });
    setState(res.ok ? 'sent' : 'error');
    if (res.ok) window.location.assign('/thank-you');
  }

  if (state === 'sent') return null;
  const field = `w-full border px-4 py-3 text-sm outline-none transition-colors ${dark
    ? 'border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:border-gold'
    : 'border-line bg-white text-ink placeholder:text-stone focus:border-goldDeep'}`;

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" aria-label="Request a detailed quote">
      <input name="name" required placeholder="Your name" className={field} />
      <input name="phone" required type="tel" placeholder="Phone number" className={field} />
      <input name="postcode" required placeholder="Postcode" className={field} />
      {!compact && <textarea name="message" rows={3} placeholder="Tell us about the project (optional)" className={field} />}
      <button disabled={state === 'sending'}
        className="bg-gold px-6 py-4 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-white disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : 'Request my detailed quote'}
      </button>
      {state === 'error' && <p className={`text-sm ${dark ? 'text-gold' : 'text-red-700'}`}>That didn't send, please call or WhatsApp us instead.</p>}
    </form>
  );
}
