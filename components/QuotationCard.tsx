'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * The "sample quotation" document in the cost section. Animates in on scroll:
 * letterhead first, then each line item staggered like it's being itemised,
 * the total row, and finally the FIXED PRICE stamp pressing down.
 */
export default function QuotationCard({ included }: { included: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fade = (visible: boolean) =>
    `transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`;

  const itemDelay = (i: number) => 150 + i * 90;
  const totalDelay = 150 + included.length * 90 + 120;
  const stampDelay = totalDelay + 300;

  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''} border border-line bg-white shadow-[0_24px_64px_rgba(26,23,20,0.12)]`}>
      <div aria-hidden="true" className="h-[3px] w-full bg-gold" />
      <div className="p-6 md:p-10">
        <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div className={fade(inView)} style={{ transitionDelay: '80ms' }}>
            <p className="font-display text-2xl tracking-[0.08em]">J.BERRY</p>
            <p className="eyebrow mt-1">Sample quotation</p>
          </div>
          <div
            aria-hidden="true"
            className={`rotate-[5deg] border-2 border-gold/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-goldDeep/80 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
              inView ? 'scale-100 opacity-100' : 'scale-[1.7] opacity-0'
            }`}
            style={{ transitionDelay: `${stampDelay}ms` }}
          >
            Fixed price
          </div>
        </div>
        <ul>
          {included.map((item, i) => (
            <li
              key={item}
              className={`flex items-baseline gap-3 border-b border-line py-4 ${fade(inView)}`}
              style={{ transitionDelay: `${itemDelay(i)}ms` }}
            >
              <span className="max-w-[75%] text-sm leading-relaxed text-stone">{item}</span>
              <span aria-hidden="true" className="flex-1 -translate-y-[3px] border-b border-dotted border-stone/40" />
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-eyebrow text-goldDeep">Included</span>
            </li>
          ))}
        </ul>
        <div
          className={`mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-4 border-double border-ink pt-5 ${fade(inView)}`}
          style={{ transitionDelay: `${totalDelay}ms` }}
        >
          <p className="font-display text-lg md:text-xl">The price we quote</p>
          <p className="font-display text-lg text-goldDeep md:text-xl">is the price you pay</p>
        </div>
      </div>
    </div>
  );
}
