import type { Metadata } from 'next';
import landing from '@/data/town-landings/grays-lofts.json';
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

export default function GraysLoftConversionsPage() {
  return (
    <>
      <JsonLd
        data={townServiceSchema({
          serviceType: 'Loft conversions',
          townName: landing.town,
          path: landing.seo.canonical,
        })}
      />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Loft Conversions', path: '/loft-conversions' },
          { name: 'Essex', path: '/loft-conversions/essex' },
          { name: landing.town, path: landing.seo.canonical },
        ])}
      />
      <JsonLd data={faqSchema(landing.faqs)} />
      <TownExtensionLanding data={landing} />
    </>
  );
}
