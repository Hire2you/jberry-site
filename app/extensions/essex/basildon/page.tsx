import type { Metadata } from 'next';
import landing from '@/data/town-landings/basildon-extensions.json';
import {
  breadcrumbSchema,
  faqSchema,
  JsonLd,
  localBusinessSchema,
  townServiceSchema,
} from '@/lib/schema';
import TownExtensionLanding from '@/components/TownExtensionLanding';

export const metadata: Metadata = {
  title: { absolute: landing.seo.title },
  description: landing.seo.description,
  alternates: { canonical: landing.seo.canonical },
  openGraph: {
    title: landing.seo.title,
    description: landing.seo.description,
    url: landing.seo.canonical,
    images: [
      {
        url: landing.hero.image.src,
        alt: landing.hero.image.alt,
      },
    ],
  },
};

export default function BasildonExtensionsPage() {
  return (
    <>
      <JsonLd
        data={townServiceSchema({
          serviceType: 'House extension design and build',
          townName: landing.town,
          path: landing.seo.canonical,
        })}
      />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'House Extensions', path: '/extensions' },
          { name: landing.town, path: landing.seo.canonical },
        ])}
      />
      <JsonLd data={faqSchema(landing.faqs)} />
      <TownExtensionLanding data={landing} />
    </>
  );
}
