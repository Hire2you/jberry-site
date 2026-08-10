'use client';
import { useEffect, useRef, useState } from 'react';
import { Receipt, Handshake, Truck, Coins, Home, Leaf, Zap, TrendingUp } from 'lucide-react';

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

/** Lucide icons matched to each comparison point. */
const moveIcons = [Receipt, Handshake, Truck, Coins];
const stayIcons = [Home, Leaf, Zap, TrendingUp];

function MoveIcon({ index }: { index: number }) {
  const Icon = moveIcons[index % moveIcons.length];
  return <Icon className="h-5 w-5" strokeWidth={1.75} />;
}

function StayIcon({ index }: { index: number }) {
  const Icon = stayIcons[index % stayIcons.length];
  return <Icon className="h-5 w-5" strokeWidth={1.75} />;
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
