import {site} from '@/lib/site'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'
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

export default function LocationCtaForm({
  block,
  serviceSlug,
  locationSlug,
}: {
  block: Extract<LocationSection, {_type: 'ctaFormBlock'}>
  serviceSlug: string
  locationSlug: string
}) {
  const theme = resolveTheme(block.theme, 'dark')
  const align = resolveAlignment(block.textAlignment)
  const padding = resolvePadding(block.paddingSize)
  const tone = sectionTone(theme)
  // Keep the familiar near-black CTA band when dark; light/cream use shared tones.
  const sectionBg = theme === 'dark' ? 'bg-charcoalDeep text-white' : tone.section

  return (
    <section id="quote" className={`scroll-mt-28 ${sectionBg}`}>
      <div
        className={`mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 ${sectionPaddingClass(padding)} ${sectionAlignClass(align)}`}
      >
        <Reveal>
          <p className="eyebrow">Start your project</p>
          <h2 className={`mt-3 text-4xl md:text-5xl ${tone.heading}`}>{block.headline}</h2>
          {block.subheading && (
            <p className={`mt-5 whitespace-pre-line ${tone.muted}`}>{block.subheading}</p>
          )}
          <p className={`mt-6 text-sm ${tone.muted}`}>
            Or call{' '}
            <a
              href={site.phoneHref}
              className={
                theme === 'dark'
                  ? 'font-semibold text-gold hover:text-white'
                  : 'font-semibold text-goldDeep hover:text-ink'
              }
            >
              {site.phone}
            </a>
          </p>
          <SectionButton
            showButton={block.showButton}
            buttonText={block.buttonText}
            buttonLink={block.buttonLink}
            align={align}
          />
        </Reveal>
        <Reveal delay={100}>
          <div
            className={`border border-gold bg-white p-6 text-ink shadow-[0_16px_48px_rgba(0,0,0,0.35)] md:p-8 ${theme === 'dark' ? '' : 'shadow-none'}`}
          >
            <p className="eyebrow">Your detailed quotation</p>
            <p className="mt-2 font-display text-2xl leading-snug">
              Priced line by line, before you commit
            </p>
            <div className="mt-5">
              <LeadForm compact service={serviceSlug} location={locationSlug} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-stone">
              {site.director} replies the same working day · Free site visit, no obligation
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
