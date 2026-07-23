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
}: {
  page: LocationPageDocument
  serviceSlug: string
  locationSlug: string
  carouselProjects: CarouselSlide[]
  testimonials: Testimonial[]
}) {
  const sections = page.sections || []

  return (
    <>
      {sections.map((block) => (
        <Section
          key={block._key}
          block={block}
          serviceSlug={serviceSlug}
          locationSlug={locationSlug}
          carouselProjects={carouselProjects}
          testimonials={testimonials}
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
}: {
  block: LocationSection
  serviceSlug: string
  locationSlug: string
  carouselProjects: CarouselSlide[]
  testimonials: Testimonial[]
}) {
  switch (block._type) {
    case 'heroBlock':
      return <LocationHero block={block} />
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
