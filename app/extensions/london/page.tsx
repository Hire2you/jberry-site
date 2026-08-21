import type { Metadata } from 'next';
import hub from '@/data/county-hubs/extensions-london.json';
import { countyServiceSchema, breadcrumbSchema, faqSchema, JsonLd } from '@/lib/schema';
import ExtensionCountyHubLanding from '@/components/ExtensionCountyHubLanding';

export const metadata: Metadata = {
  title: { absolute: hub.seo.title },
  description: hub.seo.description,
  alternates: { canonical: hub.seo.canonical },
  openGraph: {
    title: hub.seo.title,
    description: hub.seo.description,
    url: hub.seo.canonical,
    images: [{ url: hub.hero.image.src, alt: hub.hero.image.alt }],
  },
};

export default function LondonHouseExtensionsPage() {
  return (
    <>
      <JsonLd
        data={countyServiceSchema({
          serviceType: 'House extensions',
          areaName: hub.county,
          path: hub.seo.canonical,
          areaType: 'City',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'House Extensions', path: '/extensions' },
          { name: hub.county, path: hub.seo.canonical },
        ])}
      />
      <JsonLd data={faqSchema(hub.faqs)} />
      <ExtensionCountyHubLanding data={hub} />
    </>
  );
}
