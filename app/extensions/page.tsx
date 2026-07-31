import type { Metadata } from 'next';
import services from '@/data/services.json';
import { serviceLandingSchema, faqSchema, JsonLd } from '@/lib/schema';
import { site } from '@/lib/site';
import type { Testimonial } from '@/lib/testimonials';
import type { SanityProject } from '@/lib/projects';
import { toCarouselSlides } from '@/lib/projects';
import type { LocationPage } from '@/lib/locations';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import { sanityFetch } from '@/sanity/live';
import {
  LOCATION_PAGES_BY_SERVICE_QUERY,
  PROJECTS_BY_TYPE_QUERY,
  TESTIMONIALS_BY_CATEGORY_QUERY,
} from '@/sanity/queries';

const s = services.find((x) => x.slug === 'extensions')!;

export const metadata: Metadata = {
  title: `House Extensions in London, Kent & Essex, from £${(s.priceFrom / 1000).toFixed(0)}k`,
  description:
    'Director-led house extensions across London, Kent and Essex. Single and double-storey builds, itemised and fixed-price, backed by a 10-year guarantee.',
  alternates: { canonical: '/extensions' },
};

export default async function ExtensionsPage() {
  const [{ data: testimonialData }, { data: projectData }, { data: locationData }] =
    await Promise.all([
      sanityFetch({
        query: TESTIMONIALS_BY_CATEGORY_QUERY,
        params: { category: 'extension' },
      }),
      sanityFetch({
        query: PROJECTS_BY_TYPE_QUERY,
        params: { projectType: 'extension' },
      }),
      sanityFetch({
        query: LOCATION_PAGES_BY_SERVICE_QUERY,
        params: { serviceType: 'extension' },
      }),
    ]);
  const testimonials = (testimonialData || []) as Testimonial[];
  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[]);
  const locationPages = (locationData || []) as LocationPage[];

  return (
    <>
      <JsonLd data={serviceLandingSchema(s.name, s.priceFrom, s.priceTo, '/extensions')} />
      <JsonLd data={faqSchema(s.landing.faqs)} />
      <ServiceLandingPage
        serviceSlug={s.slug}
        serviceName={s.name}
        shortName={s.shortName}
        landing={s.landing}
        testimonials={testimonials}
        carouselProjects={carouselProjects}
        locationPages={locationPages}
      />
    </>
  );
}
