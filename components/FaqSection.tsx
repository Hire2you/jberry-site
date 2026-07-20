'use client';
import { useState } from 'react';
import faqs from '@/data/faqs.json';
import { site } from '@/lib/site';
import Reveal from '@/components/Reveal';
import SectionIndex from '@/components/SectionIndex';
import GoldPattern from '@/components/GoldPattern';

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-y border-line bg-ivory">
      <GoldPattern id="lattice-faq" />
      <SectionIndex label="07 · Questions" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Common questions</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Before you ask</h2>
            <p className="mt-4 font-display italic text-lg text-stone">
              The questions every client asks {site.director} at the first site visit.
            </p>
            <p className="mt-6 text-sm text-stone">
              Anything else?{' '}
              <a href={site.phoneHref} className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">
                Call {site.phone}
              </a>{' '}
              — you&rsquo;ll speak to {site.director}, not a call centre.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="border-t border-line">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="group flex w-full items-baseline gap-5 py-5 text-left"
                    >
                      <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, '0')}</span>
                      <span className="flex-1 font-display text-lg leading-snug transition-colors group-hover:text-goldDeep md:text-xl">
                        {f.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`self-center font-display text-2xl leading-none text-gold transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${i}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 pl-[2.6rem] pr-10 text-sm leading-relaxed text-stone md:text-base">{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
