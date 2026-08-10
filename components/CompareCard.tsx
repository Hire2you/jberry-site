'use client';
import { useEffect, useRef, useState } from 'react';

export type CompareData = {
  title: string;
  moveLabel: string;
  moveItems: string[];
  moveTotal: string;
  stayLabel: string;
  stayItems: string[];
  stayTotal: string;
  cta: string;
};

/** Consistent, rounded line icons matched to each comparison point. */
function MoveIcon({ index }: { index: number }) {
  const icons = [
    // Stamp duty — receipt with a tax stamp
    <svg key="stamp" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 3h9l3 3v15l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.2V3z" />
      <circle cx="15" cy="9.5" r="2.5" />
      <path d="M8 15h5" />
    </svg>,
    // Estate agent & legal fees — handshake
    <svg key="handshake" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2 12.5l4-4 4 2.5" />
      <path d="M22 12.5l-4-4-3 2" />
      <path d="M6 8.5l4.5 4.5a1.7 1.7 0 0 0 2.4 0 1.7 1.7 0 0 0 0-2.4" />
      <path d="M13.5 11l1.3 1.3a1.7 1.7 0 0 1 0 2.4 1.7 1.7 0 0 1-2.4 0" />
      <path d="M12.4 14.7a1.7 1.7 0 0 1-2.4 2.4" />
      <path d="M2 12.5V18h3M22 12.5V18h-3" />
    </svg>,
    // Removals & upheaval — moving van
    <svg key="truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2 6h10v10H2z" />
      <path d="M12 10h4l4 3.2V16h-8z" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>,
    // Paying a premium — coin stack with upward arrow
    <svg key="premium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <ellipse cx="9" cy="7" rx="6" ry="2.5" />
      <path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7" />
      <path d="M3 11v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
      <path d="M17 9l3.5-3.5M21 9V5.5h-3.5" />
    </svg>,
  ];
  return icons[index % icons.length];
}

function StayIcon({ index }: { index: number }) {
  const icons = [
    // Structure already there — roof / loft
    <svg key="roof" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 12L12 4l9 8" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M6 10.5L12 6l6 4.5" />
      <path d="M10 20v-4h4v4" />
    </svg>,
    // Not an inch of garden lost — leaf
    <svg key="leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M11 20a7 7 0 0 1-7-7c0-4 2-8 8-13 6 5 8 9 8 13a7 7 0 0 1-7 7 6.9 6.9 0 0 1-2-.3" />
      <path d="M11.5 20V10" />
    </svg>,
    // Quickest way — speed / bolt
    <svg key="bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>,
    // Value added — trending up
    <svg key="trend" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 17l6.5-6.5 4 4L21 6" />
      <path d="M15 6h6v6" />
    </svg>,
  ];
  return icons[index % icons.length];
}

/**
 * "Extend vs move" editorial comparison in the intro section. Two open panels
 * side by side — visually distinct from the sample quotation document in the
 * cost section — ending with a centred verdict and CTA.
 */
export default function CompareCard({ compare }: { compare: CompareData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const panelFade = (delay: number) =>
    `transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`;

  const panel = (
    label: string,
    items: string[],
    total: string,
    variant: 'move' | 'stay',
    delay: number,
  ) => (
    <div
      className={`flex flex-col ${panelFade(delay)} ${
        variant === 'move'
          ? 'border border-line bg-ivory'
          : 'border border-gold bg-white shadow-[0_16px_48px_rgba(26,23,20,0.08)]'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {variant === 'stay' && (
        <div aria-hidden="true" className="h-[3px] w-full bg-gold" />
      )}
      <div className="flex flex-1 flex-col p-7 md:p-9">
        <p
          className={`font-display text-xl leading-snug md:text-2xl ${
            variant === 'move' ? 'text-stone' : 'text-goldDeep'
          }`}
        >
          {label}
        </p>
        {variant === 'stay' && (
          <div aria-hidden="true" className="mt-3 h-px w-10 bg-gold" />
        )}
        <ul className="mt-6 flex-1 space-y-4">
          {items.map((item, i) => (
            <li key={item} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                  variant === 'move'
                    ? 'border-line/70 bg-white text-stone'
                    : 'border-gold/30 bg-gold/10 text-goldDeep'
                }`}
              >
                {variant === 'move' ? <MoveIcon index={i} /> : <StayIcon index={i} />}
              </span>
              <span
                className={`pt-1 text-sm leading-relaxed ${
                  variant === 'move' ? 'text-stone' : 'text-ink'
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
        <p
          className={`mt-6 border-t pt-5 font-display text-lg leading-snug text-ink md:text-xl ${
            variant === 'move' ? 'border-line' : 'border-gold/40'
          }`}
        >
          {total}
        </p>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''}`}>
      <p
        className={`text-center eyebrow ${panelFade(0)}`}
        style={{ transitionDelay: '0ms' }}
      >
        {compare.title}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        {panel(compare.moveLabel, compare.moveItems, compare.moveTotal, 'move', 80)}
        {panel(compare.stayLabel, compare.stayItems, compare.stayTotal, 'stay', 160)}
      </div>
      <div
        className={`mt-10 flex flex-col items-center gap-5 text-center ${panelFade(240)}`}
        style={{ transitionDelay: '240ms' }}
      >
        <p className="font-display text-2xl md:text-3xl">Stay put. Build better.</p>
        <a
          href="#quote"
          className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
        >
          {compare.cta}
        </a>
      </div>
    </div>
  );
}
