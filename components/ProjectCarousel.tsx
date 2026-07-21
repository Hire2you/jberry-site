'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

const ROTATE_MS = 4000;

// Placeholder slides reusing existing site imagery — swap for real project photos later.
const allSlides = [
  { service: 'extensions', src: '/images/extension-rear-bifolds.webp', alt: 'Full-width rear extension with bifold doors', title: 'Rear extension', location: 'Essex' },
  { service: 'loft-conversions', src: '/images/loft-dormer-front.webp', alt: 'Contemporary clad dormer loft conversion', title: 'Dormer loft conversion', location: 'Essex' },
  { service: 'extensions', src: '/images/extension-orangery.webp', alt: 'Orangery-style extension to a period property', title: 'Orangery extension', location: 'Hertfordshire' },
  { service: 'loft-conversions', src: '/images/loft-wardrobes.webp', alt: 'Loft bedroom with full-length built-in wardrobes', title: 'Loft conversion', location: 'South Woodford' },
  { service: 'extensions', src: '/images/barn-garden-room.webp', alt: 'Garden room with exposed timber frame', title: 'Garden room', location: 'Hertfordshire' },
];

export default function ProjectCarousel({ service }: { service?: string }) {
  const slides = useMemo(
    () => (service ? allSlides.filter((s) => s.service === service) : allSlides),
    [service],
  );

  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const cappedVisible = Math.min(visible, Math.max(slides.length, 1));
  const maxIndex = Math.max(0, slides.length - cappedVisible);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setVisible(mq.matches ? 3 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex, slides.length]);

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, maxIndex)));
  }, [maxIndex]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    setPaused(true);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (!dragging && Math.abs(dy) > Math.abs(dx)) return;
    setDragging(true);
    const atEdge = (index === 0 && dx > 0) || (index >= maxIndex && dx < 0);
    setDragX(atEdge ? dx * 0.3 : dx);
  }

  function onTouchEnd() {
    if (dragging) {
      const threshold = 50;
      if (dragX <= -threshold) goTo(index + 1);
      else if (dragX >= threshold) goTo(index - 1);
    }
    touchStart.current = null;
    setDragX(0);
    setDragging(false);
    setPaused(false);
  }

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, maxIndex]);

  if (slides.length === 0) return null;

  return (
    <section aria-label="Recent project photos" className="relative bg-band">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden md:px-4 md:pt-6 md:pb-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="touch-pan-y overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div
            className={`flex md:-mx-2 ${dragging ? '' : 'transition-transform duration-700 ease-in-out'}`}
            style={{ transform: `translateX(calc(-${index * (100 / cappedVisible)}% + ${dragX}px))` }}
          >
            {slides.map((s, i) => {
              const inView = i >= index && i < index + cappedVisible;
              const slideWidth = cappedVisible === 1 ? 'w-full' : cappedVisible === 2 ? 'w-full md:w-1/2' : 'w-full md:w-1/3';
              return (
                <div key={s.src} className={`${slideWidth} shrink-0 md:px-2`} aria-hidden={!inView}>
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

        {maxIndex > 0 && (
          <>
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
          </>
        )}

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
