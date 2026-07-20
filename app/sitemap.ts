import type { MetadataRoute } from 'next';
import services from '@/data/services.json';
import locations from '@/data/locations.json';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = services.flatMap((s) => locations.map((l) => ({ url: `${site.domain}/${s.slug}/${l.slug}`, changeFrequency: 'monthly' as const })));
  return [
    { url: site.domain, changeFrequency: 'weekly' },
    { url: `${site.domain}/cost-guides/loft-conversion-cost`, changeFrequency: 'monthly' },
    ...pages,
  ];
}
