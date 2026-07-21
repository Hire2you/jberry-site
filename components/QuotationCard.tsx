'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * The "sample quotation" document in the cost section. Animates in on scroll:
 * letterhead first, then each line item staggered like it's being itemised,
 * the total row, and finally the FIXED PRICE stamp pressing down.
 * On desktop the whole card also parallaxes slightly faster than the page,
 * so it drifts against the text column while scrolling.
 */
export default function QuotationCard({ included }: { included: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
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

  // Scroll-linked parallax: the card drifts ~20% faster than the page on desktop,
  // so it slides against the left text column. Off on mobile (stacked layout)
  // and for prefers-reduced-motion.
  useEffect(() => {
    const measure = measureRef.current;
    const el = parallaxRef.current;
    if (!measure || !el) return;

    const desktop = window.matchMedia('(min-width: 1024px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let anchorY = 0;

    const cacheAnchor = () => {
      const r = measure.getBoundingClientRect();
      anchorY = window.scrollY + r.top + r.height / 2;
    };

    const update = () => {
      raf = 0;
      if (!desktop.matches || reducedMotion.matches) {
        el.style.transform = '';
        return;
      }
      // How far the viewport centre has scrolled past the card's natural centre.
      // Scrolling down → positive delta → negative translateY → card rises faster.
      const delta = window.scrollY + window.innerHeight / 2 - anchorY;
      const shift = Math.max(-72, Math.min(72, -delta * 0.22));
      el.style.transform = `translate3d(0, ${shift}px, 0)`;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { cacheAnchor(); onScroll(); };

    cacheAnchor();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const fade = (visible: boolean) =>
    `transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`;

  const itemDelay = (i: number) => 150 + i * 90;
  const totalDelay = 150 + included.length * 90 + 120;
  const stampDelay = totalDelay + 300;

  return (
    <div ref={measureRef}>
      <div ref={parallaxRef} className="will-change-transform">
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
      </div>
    </div>
  );
}
