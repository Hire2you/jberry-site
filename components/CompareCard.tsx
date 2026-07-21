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

/**
 * "Extend vs move" comparison card in the intro section. Two ledgers under one
 * header: the sunk costs of moving on the left, the case for staying and
 * building on the right. Line items stagger in on scroll like the sample
 * quotation card, ending with a verdict row and a CTA to the quote form.
 */
export default function CompareCard({ compare }: { compare: CompareData }) {
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
  const rows = Math.max(compare.moveItems.length, compare.stayItems.length);
  const totalDelay = 150 + rows * 90 + 120;

  const ledger = (
    label: string,
    items: string[],
    total: string,
    variant: 'move' | 'stay',
  ) => (
    <div className={variant === 'stay' ? 'border-t border-line pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0' : 'sm:pr-6'}>
      <p
        className={`text-[10px] font-bold uppercase tracking-eyebrow ${variant === 'move' ? 'text-stone' : 'text-goldDeep'} ${fade(inView)}`}
        style={{ transitionDelay: '80ms' }}
      >
        {label}
      </p>
      <ul className="mt-2">
        {items.map((item, i) => (
          <li
            key={item}
            className={`flex items-baseline gap-2.5 border-b border-line py-3 ${fade(inView)}`}
            style={{ transitionDelay: `${itemDelay(i)}ms` }}
          >
            {variant === 'move' ? (
              <span aria-hidden="true" className="shrink-0 translate-y-[-1px] text-sm leading-none text-stone/60">&minus;</span>
            ) : (
              <span aria-hidden="true" className="shrink-0 translate-y-[-1px] text-sm leading-none text-goldDeep">&#10003;</span>
            )}
            <span className={`text-sm leading-relaxed ${variant === 'move' ? 'text-stone/80' : 'text-ink'}`}>{item}</span>
          </li>
        ))}
      </ul>
      <p
        className={`mt-4 text-sm font-semibold ${variant === 'move' ? 'text-stone' : 'text-goldDeep'} ${fade(inView)}`}
        style={{ transitionDelay: `${totalDelay}ms` }}
      >
        {total}
      </p>
    </div>
  );

  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''} border border-line bg-white shadow-[0_24px_64px_rgba(26,23,20,0.12)]`}>
      <div aria-hidden="true" className="h-[3px] w-full bg-gold" />
      <div className="p-6 md:p-8">
        <div className={`border-b border-line pb-5 ${fade(inView)}`} style={{ transitionDelay: '80ms' }}>
          <p className="font-display text-2xl tracking-[0.08em]">J.BERRY</p>
          <p className="eyebrow mt-1">{compare.title}</p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-0">
          {ledger(compare.moveLabel, compare.moveItems, compare.moveTotal, 'move')}
          {ledger(compare.stayLabel, compare.stayItems, compare.stayTotal, 'stay')}
        </div>
        <div
          className={`mt-8 flex flex-wrap items-center justify-between gap-4 border-t-4 border-double border-ink pt-5 ${fade(inView)}`}
          style={{ transitionDelay: `${totalDelay + 200}ms` }}
        >
          <p className="font-display text-lg">Stay put. Build better.</p>
          <a
            href="#quote"
            className="bg-charcoal px-5 py-3 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
          >
            {compare.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
