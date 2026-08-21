import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import LocationPageSections from '@/components/location-sections/LocationPageSections'
import {
  locationMatchesParam,
  normalizeLocationSlug,
  type LocationPageDocument,
} from '@/lib/location-page'
import type {SanityProject} from '@/lib/projects'
import {toCarouselSlides} from '@/lib/projects'
import type {Testimonial} from '@/lib/testimonials'
import {sanityFetch} from '@/sanity/live'
import {
  LOCATION_PAGE_QUERY,
  LOCATION_PAGE_SLUGS_QUERY,
  PROJECTS_FOR_LOCATION_QUERY,
  TESTIMONIALS_BY_CATEGORY_QUERY,
} from '@/sanity/queries'

type ServiceSlug = 'extensions' | 'loft-conversions'

function serviceTypeFromSlug(serviceSlug: ServiceSlug) {
  return serviceSlug === 'extensions' ? 'extension' : 'loft-conversion'
}

function testimonialCategoryFromSlug(serviceSlug: ServiceSlug) {
  return serviceTypeFromSlug(serviceSlug)
}

export async function generateLocationStaticParams(serviceSlug: ServiceSlug) {
  const serviceType = serviceTypeFromSlug(serviceSlug)
  const {data} = await sanityFetch({
    query: LOCATION_PAGE_SLUGS_QUERY,
    params: {serviceType},
    perspective: 'published',
    stega: false,
  })

  return ((data || []) as Array<{slug: string}>)
    .map((doc) => normalizeLocationSlug(doc.slug))
    .filter(Boolean)
    .filter((slug) => !(serviceSlug === 'loft-conversions' && (slug === 'essex' || slug === 'london')))
    .map((location) => ({location}))
}

export async function generateLocationMetadata(
  serviceSlug: ServiceSlug,
  location: string,
): Promise<Metadata> {
  const page = await fetchLocationPage(serviceSlug, location, {stega: false})
  if (!page) return {}

  const title =
    page.seoTitle ||
    `${serviceSlug === 'extensions' ? 'Extensions' : 'Loft conversions'} in ${page.town}`

  return {
    title,
    description: page.seoDescription,
    alternates: {canonical: `/${serviceSlug}/${normalizeLocationSlug(page.slug)}`},
  }
}

export async function fetchLocationPage(
  serviceSlug: ServiceSlug,
  location: string,
  options?: {stega?: boolean},
) {
  const serviceType = serviceTypeFromSlug(serviceSlug)
  const {data} = await sanityFetch({
    query: LOCATION_PAGE_QUERY,
    params: {serviceType, location},
    stega: options?.stega,
  })
  const page = data as LocationPageDocument | null
  if (!page) return null
  if (!locationMatchesParam(page.slug, location)) return null
  return page
}

export async function LocationLandingPage({
  serviceSlug,
  location,
}: {
  serviceSlug: ServiceSlug
  location: string
}) {
  const page = await fetchLocationPage(serviceSlug, location)
  if (!page) notFound()

  const serviceType = serviceTypeFromSlug(serviceSlug)
  const locationSlug = normalizeLocationSlug(page.slug)

  const [{data: projectData}, {data: testimonialData}] = await Promise.all([
    sanityFetch({
      query: PROJECTS_FOR_LOCATION_QUERY,
      params: {
        serviceType: page.serviceType === 'both' ? serviceType : page.serviceType,
        town: page.town,
        county: page.county,
      },
    }),
    sanityFetch({
      query: TESTIMONIALS_BY_CATEGORY_QUERY,
      params: {category: testimonialCategoryFromSlug(serviceSlug)},
    }),
  ])

  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[])
  const testimonials = (testimonialData || []) as Testimonial[]

  if (!page.sections?.length) {
    return (
      <>
        <section className="relative overflow-hidden bg-band">
          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
            <p className="eyebrow !text-[#EBCF8E]">
              {page.town}, {page.county}
            </p>
            <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl">
              {serviceSlug === 'extensions' ? 'Extensions' : 'Loft conversions'} in {page.town}
            </h1>
            <p className="mt-4 max-w-xl text-white/85">
              Director-led builds with detailed quotations. Add page sections in Sanity to customise
              this location landing page.
            </p>
          </div>
        </section>
        <LocationPageSections
          page={{
            ...page,
            sections: [
              {
                _key: 'fallback-cta',
                _type: 'ctaFormBlock',
                headline: 'Get your detailed quotation',
                subheading: `Tell us about your project in ${page.town} and we'll call you back, usually the same working day.`,
              },
            ],
          }}
          serviceSlug={serviceSlug}
          locationSlug={locationSlug}
          carouselProjects={carouselProjects}
          testimonials={testimonials}
          suppressTitleFallback
        />
      </>
    )
  }

  return (
    <LocationPageSections
      page={page}
      serviceSlug={serviceSlug}
      locationSlug={locationSlug}
      carouselProjects={carouselProjects}
      testimonials={testimonials}
    />
  )
}
