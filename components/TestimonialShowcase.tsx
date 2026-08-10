'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Testimonial } from '@/lib/testimonials';

const FADE_MS = 300;
const INTERVAL_MS = 7000;

export default function TestimonialShowcase({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const fadeTimeout = useRef<number | undefined>(undefined);

  const transitionTo = useCallback((resolve: (current: number) => number) => {
    setVisible(false);
    window.clearTimeout(fadeTimeout.current);
    fadeTimeout.current = window.setTimeout(() => {
      setIndex(resolve);
      setVisible(true);
    }, FADE_MS);
  }, []);

  const advance = useCallback(
    (dir: number) =>
      transitionTo((i) => (testimonials.length ? (i + dir + testimonials.length) % testimonials.length : 0)),
    [testimonials.length, transitionTo],
  );

  useEffect(() => () => window.clearTimeout(fadeTimeout.current), []);

  // Restarts whenever index changes, so manual navigation resets the 7s timer.
  useEffect(() => {
    if (testimonials.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => advance(1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [advance, index, testimonials.length]);

  useEffect(() => {
    if (index >= testimonials.length) setIndex(0);
  }, [index, testimonials.length]);

  if (!testimonials.length) {
    return (
      <p className="mx-auto max-w-xl text-center text-stone leading-relaxed">
        Client stories will appear here as reviews come in. Rated on Google and Checkatrade via the badges
        above.
      </p>
    );
  }

  const t = testimonials[index] ?? testimonials[0];
  const multi = testimonials.length > 1;

  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="relative overflow-x-clip px-4 pt-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none font-display text-[120px] leading-none text-gold/30 md:text-[160px]"
        >
          &ldquo;
        </span>
        <figure
          className={`relative transition-opacity duration-300 motion-reduce:transition-none ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          <blockquote className="mt-6 font-display text-2xl italic leading-relaxed text-ink md:text-3xl">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mx-auto mt-8 h-px w-16 bg-gold" />
          <figcaption className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-eyebrow text-ink">
              {t.name}
              {t.location && (
                <span className="font-normal normal-case tracking-normal text-stone">, {t.location}</span>
              )}
            </p>
            {t.project && <p className="mt-2 text-sm text-stone">{t.project}</p>}
            {t.highlight && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-eyebrow text-goldDeep">
                {t.highlight}
              </p>
            )}
          </figcaption>
        </figure>
      </div>

      {multi && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => advance(-1)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-gold hover:text-gold"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            {testimonials.map((item, i) => (
              <button
                key={item._id || item.name}
                type="button"
                onClick={() => i !== index && transitionTo(() => i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index ? true : undefined}
                className={
                  i === index
                    ? 'h-1 w-8 bg-gold transition-all'
                    : 'h-1.5 w-1.5 rounded-full bg-line transition-all hover:bg-gold/60'
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => advance(1)}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-gold hover:text-gold"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
