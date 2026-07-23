import {site} from '@/lib/site'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'
import type {LocationSection} from '@/lib/location-page'

export default function LocationCtaForm({
  block,
  serviceSlug,
  locationSlug,
}: {
  block: Extract<LocationSection, {_type: 'ctaFormBlock'}>
  serviceSlug: string
  locationSlug: string
}) {
  return (
    <section id="quote" className="scroll-mt-28 bg-charcoalDeep text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Start your project</p>
          <h2 className="mt-3 text-4xl md:text-5xl">{block.headline}</h2>
          {block.subheading && (
            <p className="mt-5 text-white/70 whitespace-pre-line">{block.subheading}</p>
          )}
          <p className="mt-6 text-sm text-white/60">
            Or call{' '}
            <a href={site.phoneHref} className="font-semibold text-gold hover:text-white">
              {site.phone}
            </a>
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="border border-gold bg-white p-6 text-ink shadow-[0_16px_48px_rgba(0,0,0,0.35)] md:p-8">
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
