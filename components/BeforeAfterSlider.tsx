'use client';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

export type BeforeAfterSliderProps = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  className?: string;
  aspectClassName?: string;
};

const STEP = 4;

export default function BeforeAfterSlider({
  before,
  after,
  className = '',
  aspectClassName = 'aspect-[4/3]',
}: BeforeAfterSliderProps) {
  const [percent, setPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const stopDragging = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPercent((p) => Math.max(0, p - STEP));
    else if (e.key === 'ArrowRight') setPercent((p) => Math.min(100, p + STEP));
    else if (e.key === 'Home') setPercent(0);
    else if (e.key === 'End') setPercent(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className={`group relative ${aspectClassName} w-full touch-none select-none overflow-hidden bg-line/40 ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
      onPointerCancel={stopDragging}
      onDoubleClick={() => setPercent(50)}
    >
      {/* After — full image, base layer */}
      <Image
        src={after.src}
        alt={after.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="pointer-events-none object-cover"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 z-[1] bg-charcoal/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-opacity"
        style={{ opacity: percent < 90 ? 1 : 0 }}
      >
        After
      </span>

      {/* Before — same image, clipped to the slider position */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <span
          className="absolute bottom-3 left-3 z-[1] bg-charcoal/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-opacity"
          style={{ opacity: percent > 10 ? 1 : 0 }}
        >
          Before
        </span>
      </div>

      {/* Divider + drag handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-[2] w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${percent}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare before and after"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 z-[3] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-gold bg-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 group-hover:scale-105"
        style={{ left: `${percent}%` }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B08D3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
        </svg>
      </div>

      {/* Corner accent, on brand with the rest of the page */}
      <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-[1] h-[3px] w-10 bg-gold" />
    </div>
  );
}
