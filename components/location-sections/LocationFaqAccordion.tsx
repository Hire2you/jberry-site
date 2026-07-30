'use client'

import {useState} from 'react'
import {site} from '@/lib/site'
import Reveal from '@/components/Reveal'
import GoldPattern from '@/components/GoldPattern'
import type {LocationSection} from '@/lib/location-page'
import {
  SectionButton,
  resolveAlignment,
  resolvePadding,
  resolveTheme,
  sectionAlignClass,
  sectionPaddingClass,
  sectionTone,
} from '@/components/location-sections/sectionSettings'

export default function LocationFaqAccordion({
  block,
}: {
  block: Extract<LocationSection, {_type: 'faqAccordionBlock'}>
}) {
  const faqs = block.faqs || []
  const [open, setOpen] = useState<number | null>(0)
  if (!faqs.length) return null

  const theme = resolveTheme(block.theme, 'cream')
  const align = resolveAlignment(block.textAlignment)
  const padding = resolvePadding(block.paddingSize)
  const tone = sectionTone(theme)
  const showPattern = theme !== 'dark'

  return (
    <section className={`relative border-y ${tone.border} ${tone.section}`}>
      {showPattern && <GoldPattern id={`lattice-faq-${block._key}`} />}
      <div
        className={`relative z-10 mx-auto max-w-6xl px-4 ${sectionPaddingClass(padding)} ${sectionAlignClass(align)}`}
      >
        <div className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Common questions</p>
            <h2 className={`mt-3 text-4xl md:text-5xl ${tone.heading}`}>
              {block.heading || 'Before you ask'}
            </h2>
            {block.intro && (
              <p className={`mt-4 font-display italic text-lg ${tone.muted}`}>{block.intro}</p>
            )}
            <p className={`mt-6 text-sm ${tone.muted}`}>
              Anything else?{' '}
              <a href={site.phoneHref} className={tone.link}>
                Call {site.phone}
              </a>{' '}
              and you&rsquo;ll speak to {site.director}, not a call centre.
            </p>
            <SectionButton
              showButton={block.showButton}
              buttonText={block.buttonText}
              buttonLink={block.buttonLink}
              align={align}
            />
          </Reveal>

          <Reveal delay={120}>
            <div className={`border-t ${tone.border}`}>
              {faqs.map((f, i) => {
                const isOpen = open === i
                return (
                  <div key={f._key || f.question} className={`border-b ${tone.border}`}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-baseline gap-5 py-5 text-left"
                    >
                      <span className={`font-display text-sm ${tone.goldAccent}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`flex-1 font-display text-lg leading-snug transition-colors group-hover:text-goldDeep md:text-xl ${tone.heading}`}
                      >
                        {f.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`self-center font-display text-2xl leading-none transition-transform duration-300 ${tone.goldAccent} ${isOpen ? 'rotate-45' : ''}`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="overflow-hidden">
                        <p
                          className={`pb-6 pl-[2.6rem] pr-10 text-sm leading-relaxed md:text-base whitespace-pre-line ${tone.body}`}
                        >
                          {f.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
