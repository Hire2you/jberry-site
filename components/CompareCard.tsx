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

/** Placeholder icons — swap for final assets later. */
function MoveIcon({ index }: { index: number }) {
  const icons = [
    // Stamp / tax
    <svg key="stamp" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="4" y="6" width="16" height="12" rx="1" />
      <path d="M8 10h8M8 14h5" />
    </svg>,
    // Keys / legal
    <svg key="keys" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <circle cx="8" cy="8" r="3" />
      <path d="M11 8h10v3h-3v3" />
    </svg>,
    // Moving box
    <svg key="box" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M3 8l9-4 9 4v10l-9 4-9-4V8z" />
      <path d="M12 4v18M3 8l9 4 9-4" />
    </svg>,
    // Empty house
    <svg key="house" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M3 12l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" strokeDasharray="2 2" />
    </svg>,
  ];
  return icons[index % icons.length];
}

function StayIcon({ index }: { index: number }) {
  const icons = [
    // Home / equity
    <svg key="home" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M3 12l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>,
    // No chain
    <svg key="chain" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M8 12a4 4 0 0 1 4-4h1a4 4 0 0 1 0 8h-1a4 4 0 0 1-4-4" />
      <path d="M16 12a4 4 0 0 1-4 4h-1a4 4 0 0 1 0-8h1a4 4 0 0 1 4 4" strokeDasharray="3 3" />
    </svg>,
    // Design / plan
    <svg key="plan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9h18M9 3v18" />
    </svg>,
    // Value / upward
    <svg key="value" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M4 18l6-8 4 5 6-10" />
      <path d="M18 5h2v2" />
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
      className={`flex flex-col p-6 md:p-8 ${panelFade(delay)} ${
        variant === 'move'
          ? 'border border-line bg-ivory'
          : 'border border-gold/40 bg-white'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-eyebrow ${
          variant === 'move' ? 'text-stone' : 'text-goldDeep'
        }`}
      >
        {label}
      </p>
      <ul className="mt-5 flex-1 space-y-4">
        {items.map((item, i) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                variant === 'move'
                  ? 'bg-line/80 text-stone/70'
                  : 'bg-gold/15 text-goldDeep'
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
        className={`mt-6 border-t pt-5 font-display text-lg leading-snug md:text-xl ${
          variant === 'move' ? 'border-line text-stone' : 'border-gold/30 text-goldDeep'
        }`}
      >
        {total}
      </p>
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
