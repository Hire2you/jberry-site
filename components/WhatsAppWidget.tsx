'use client';
import { useState } from 'react';
import { site } from '@/lib/site';

// Floating WhatsApp widget with pre-qualification step.
// Fires the Google Ads conversion (secondary action to start — same rule as before)
// directly on click, no GTM needed.
const OPTIONS = [
  { label: 'Loft conversion', msg: "Hi Jason, I'd like a quote for a loft conversion." },
  { label: 'Extension', msg: "Hi Jason, I'd like a quote for an extension." },
  { label: 'Something else', msg: 'Hi Jason, I have a building project to discuss.' },
];

declare global { interface Window { gtag?: (...args: unknown[]) => void } }

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  function go(msg: string) {
    const id = process.env.NEXT_PUBLIC_GADS_ID;
    const label = process.env.NEXT_PUBLIC_GADS_WHATSAPP_LABEL;
    if (window.gtag && id && label) {
      window.gtag('event', 'conversion', { send_to: `${id}/${label}` });
    }
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setOpen(false);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-64 rounded-lg border border-pine/15 bg-white p-4 shadow-xl">
          <p className="text-sm font-semibold">What's the project?</p>
          <div className="mt-3 flex flex-col gap-2">
            {OPTIONS.map((o) => (
              <button key={o.label} onClick={() => go(o.msg)}
                className="rounded border border-pine/20 px-3 py-2 text-left text-sm hover:border-whatsapp hover:bg-whatsapp/10">
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg hover:scale-105 transition-transform">
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-3-.9-5-3.4-5.7-4.4-.6-.9-1.2-2-1.2-3.1 0-1 .5-1.6.8-1.9.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.7.2.3.8 1.3 1.8 2.1 1.2 1.1 2.2 1.4 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.4 0 0 .1.5-.1 1.2Z"/>
        </svg>
      </button>
    </div>
  );
}
