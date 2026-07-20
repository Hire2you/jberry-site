'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const ROTATE_MS = 4000;

// Placeholder slides reusing existing site imagery — swap for real project photos later.
const slides = [
  { src: '/images/extension-rear-bifolds.webp', alt: 'Full-width rear extension with bifold doors', title: 'Rear extension', location: 'Essex' },
  { src: '/images/loft-dormer-front.webp', alt: 'Contemporary clad dormer loft conversion', title: 'Dormer loft conversion', location: 'Essex' },
  { src: '/images/extension-orangery.webp', alt: 'Orangery-style extension to a period property', title: 'Orangery extension', location: 'Hertfordshire' },
  { src: '/images/loft-wardrobes.webp', alt: 'Loft bedroom with full-length built-in wardrobes', title: 'Loft conversion', location: 'South Woodford' },
  { src: '/images/barn-garden-room.webp', alt: 'Garden room with exposed timber frame', title: 'Garden room', location: 'Hertfordshire' },
];

export default function ProjectCarousel() {
  // How many slides are visible at once: 1 on mobile, 3 on md+ screens.
  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const maxIndex = slides.length - visible;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setVisible(mq.matches ? 3 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setIndex((i) => Math.min(i, slides.length - visible));
  }, [visible]);

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, maxIndex)));
  }, [maxIndex]);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, maxIndex]);

  return (
    <section aria-label="Recent project photos" className="relative bg-[#0B0B0B]">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden md:px-4 md:pt-6 md:pb-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out md:-mx-2"
            style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
          >
            {slides.map((s, i) => {
              const inView = i >= index && i < index + visible;
              return (
                <div key={s.src} className="w-full shrink-0 md:w-1/3 md:px-2" aria-hidden={!inView}>
                  <div className="relative aspect-[16/10] md:aspect-[3/2]">
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 md:p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-eyebrow text-gold">{s.location}</p>
                      <p className="mt-0.5 font-display text-xl text-white md:text-[22px]">{s.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prev / next */}
        <button
          type="button"
          aria-label="Previous projects"
          onClick={() => goTo(index === 0 ? maxIndex : index - 1)}
          className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/40 bg-charcoalDeep/50 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:flex md:left-6"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
        <button
          type="button"
          aria-label="Next projects"
          onClick={() => goTo(index >= maxIndex ? 0 : index + 1)}
          className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/40 bg-charcoalDeep/50 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:flex md:right-6"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 2 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>

        {/* Dots — one per scroll position */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2.5 md:bottom-10">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to position ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`h-[3px] transition-all duration-300 ${i === index ? 'w-8 bg-gold' : 'w-4 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
