'use client';
import { useState } from 'react';

export default function LeadForm({
  service,
  location,
  dark = false,
  compact = false,
  showService = false,
}: {
  service?: string;
  location?: string;
  dark?: boolean;
  compact?: boolean;
  showService?: boolean;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const fd = new FormData(e.currentTarget);
    const selectedService = showService ? (fd.get('service') as string) || undefined : service;
    // Full path + query so the lead email shows exactly which page they came from
    const page = `${window.location.pathname}${window.location.search}` || '/';
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        phone: fd.get('phone'),
        postcode: fd.get('postcode'),
        message: fd.get('message'),
        service: selectedService || service,
        location,
        page,
      }),
    });
    setState(res.ok ? 'sent' : 'error');
    if (res.ok) window.location.assign('/thank-you');
  }

  if (state === 'sent') return null;
  const field = `w-full min-h-[48px] border px-4 py-3.5 text-base outline-none transition-colors ${
    dark
      ? 'border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:border-gold'
      : 'border-line bg-white text-ink placeholder:text-stone focus:border-goldDeep'
  }`;

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" aria-label="Request a detailed quote">
      {showService && (
        <select name="service" defaultValue="" className={field} aria-label="Project type">
          <option value="" disabled>
            Project type
          </option>
          <option value="Extension">Extension</option>
          <option value="Loft conversion">Loft conversion</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      )}
      <input name="name" required placeholder="Your name" autoComplete="name" className={field} />
      <input
        name="phone"
        required
        type="tel"
        placeholder="Phone number"
        autoComplete="tel"
        className={field}
      />
      <input
        name="postcode"
        required
        placeholder="Postcode"
        autoComplete="postal-code"
        className={field}
      />
      {!compact && (
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us about the project (optional)"
          className={`${field} min-h-[5.5rem]`}
        />
      )}
      <button
        disabled={state === 'sending'}
        className="min-h-[52px] bg-gold px-6 py-4 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-white disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Request my detailed quote'}
      </button>
      {state === 'error' && (
        <p className={`text-sm ${dark ? 'text-gold' : 'text-red-700'}`}>
          That didn&apos;t send, please call or WhatsApp us instead.
        </p>
      )}
    </form>
  );
}
