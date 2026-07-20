import { site } from '@/lib/site';
import GoldPattern from '@/components/GoldPattern';

export default function TrustBar() {
  const items = [
    { big: 'Detailed quotations', small: 'Itemised before work starts' },
    { big: 'The price we quote', small: 'is the price you pay' },
    { big: 'Director-led', small: `Every project overseen by ${site.director}` },
    { big: 'On schedule', small: 'Agreed timeline, kept' },
  ];
  return (
    <div className="relative border-y border-line bg-ivory">
      <GoldPattern id="lattice-trustbar" />
      {/* Mobile: 2x2 quadrant grid with hairline dividers. Desktop (md+): unchanged 4-across row. */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 md:gap-8 md:px-4 md:py-8">
        {items.map((t, i) => (
          <div
            key={t.big}
            className={[
              'px-5 py-7 md:p-0',
              i % 2 === 1 ? 'border-l border-line md:border-l-0' : '',
              i > 1 ? 'border-t border-line md:border-t-0' : '',
            ].join(' ')}
          >
            <div className="mb-3 h-px w-8 bg-gold md:hidden" />
            <p className="font-display text-lg">{t.big}</p>
            <p className="mt-1 text-sm text-stone">{t.small}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
