import ProjectCarousel from '@/components/ProjectCarousel'
import LocationHero from '@/components/location-sections/LocationHero'
import LocationIntroText from '@/components/location-sections/LocationIntroText'
import LocationStatsBar from '@/components/location-sections/LocationStatsBar'
import LocationCostSection from '@/components/location-sections/LocationCostSection'
import LocationFaqAccordion from '@/components/location-sections/LocationFaqAccordion'
import LocationTestimonials from '@/components/location-sections/LocationTestimonials'
import LocationCtaForm from '@/components/location-sections/LocationCtaForm'
import LocationTextAndImage from '@/components/location-sections/LocationTextAndImage'
import type {CarouselSlide} from '@/lib/projects'
import type {Testimonial} from '@/lib/testimonials'
import type {LocationPageDocument, LocationSection} from '@/lib/location-page'

export default function LocationPageSections({
  page,
  serviceSlug,
  locationSlug,
  carouselProjects,
  testimonials,
  suppressTitleFallback = false,
}: {
  page: LocationPageDocument
  serviceSlug: string
  locationSlug: string
  carouselProjects: CarouselSlide[]
  testimonials: Testimonial[]
  /** Set when the parent already rendered the page H1 (empty-sections fallback). */
  suppressTitleFallback?: boolean
}) {
  const sections = page.sections || []
  const firstHeroIndex = sections.findIndex((block) => block._type === 'heroBlock')
  const hasHero = firstHeroIndex >= 0
  const fallbackTitle =
    page.seoTitle ||
    `${serviceSlug === 'extensions' ? 'Extensions' : 'Loft conversions'} in ${page.town}`

  return (
    <>
      {!hasHero && !suppressTitleFallback && (
        <section className="relative overflow-hidden bg-band">
          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
            <p className="eyebrow !text-[#EBCF8E]">
              {page.town}, {page.county}
            </p>
            <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl">
              {fallbackTitle}
            </h1>
          </div>
        </section>
      )}
      {sections.map((block, index) => (
        <Section
          key={block._key}
          block={block}
          serviceSlug={serviceSlug}
          locationSlug={locationSlug}
          carouselProjects={carouselProjects}
          testimonials={testimonials}
          headingAs={
            block._type === 'heroBlock'
              ? index === firstHeroIndex
                ? 'h1'
                : 'h2'
              : undefined
          }
        />
      ))}
    </>
  )
}

function Section({
  block,
  serviceSlug,
  locationSlug,
  carouselProjects,
  testimonials,
  headingAs,
}: {
  block: LocationSection
  serviceSlug: string
  locationSlug: string
  carouselProjects: CarouselSlide[]
  testimonials: Testimonial[]
  headingAs?: 'h1' | 'h2'
}) {
  switch (block._type) {
    case 'heroBlock':
      return <LocationHero block={block} headingAs={headingAs ?? 'h1'} />
    case 'introTextBlock':
      return <LocationIntroText block={block} />
    case 'statsBarBlock':
      return <LocationStatsBar block={block} />
    case 'projectCarouselBlock':
      return carouselProjects.length ? (
        <div className="bg-band">
          <ProjectCarousel projects={carouselProjects} />
        </div>
      ) : null
    case 'costSectionBlock':
      return <LocationCostSection block={block} />
    case 'faqAccordionBlock':
      return <LocationFaqAccordion block={block} />
    case 'testimonialsBlock':
      return <LocationTestimonials block={block} testimonials={testimonials} />
    case 'ctaFormBlock':
      return (
        <LocationCtaForm
          block={block}
          serviceSlug={serviceSlug}
          locationSlug={locationSlug}
        />
      )
    case 'textAndImageBlock':
      return <LocationTextAndImage block={block} />
    default:
      return null
  }
}
