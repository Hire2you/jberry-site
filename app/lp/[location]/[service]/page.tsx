import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import {
  buildCampaignLanding,
  campaignStaticParams,
} from '@/lib/campaign-landing';
import type { Testimonial } from '@/lib/testimonials';
import type { SanityProject } from '@/lib/projects';
import { toCarouselSlides } from '@/lib/projects';
import { sanityFetch } from '@/sanity/live';
import { PROJECTS_BY_TYPE_QUERY, TESTIMONIALS_BY_CATEGORY_QUERY } from '@/sanity/queries';

// Google Ads campaign landing pages: full converting layout, noindexed, slim nav.
export function generateStaticParams() {
  return campaignStaticParams();
}

export const dynamicParams = false;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ location: string; service: string }> };

export default async function CampaignLandingPage({ params }: Props) {
  const { location: locationSlug, service: serviceSlug } = await params;
  const built = buildCampaignLanding(locationSlug, serviceSlug);
  if (!built) notFound();

  const { service, location, landing } = built;

  const [{ data: testimonialData }, { data: projectData }] = await Promise.all([
    sanityFetch({
      query: TESTIMONIALS_BY_CATEGORY_QUERY,
      params: { category: service.testimonialCategory },
    }),
    sanityFetch({
      query: PROJECTS_BY_TYPE_QUERY,
      params: { projectType: service.projectType },
    }),
  ]);

  const testimonials = (testimonialData || []) as Testimonial[];
  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[]);

  return (
    <ServiceLandingPage
      serviceSlug={service.slug}
      serviceName={service.name}
      shortName={service.shortName}
      landing={landing}
      testimonials={testimonials}
      carouselProjects={carouselProjects}
      locationPages={[]}
      campaignMode
      locationSlug={location.slug}
      locationName={location.name}
    />
  );
}
