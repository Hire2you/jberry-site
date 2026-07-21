import type { MetadataRoute } from 'next';
import services from '@/data/services.json';
import locations from '@/data/locations.json';
import { getAllPosts } from '@/lib/blog';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages = services.map((s) => ({ url: `${site.domain}/${s.slug}`, changeFrequency: 'weekly' as const }));
  const locationPages = services.flatMap((s) => locations.map((l) => ({ url: `${site.domain}/${s.slug}/${l.slug}`, changeFrequency: 'monthly' as const })));
  const blogPages = getAllPosts().map((p) => ({ url: `${site.domain}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'monthly' as const }));
  const countyHubs = [
    { url: `${site.domain}/loft-conversions/essex`, changeFrequency: 'monthly' as const },
  ];

  return [
    { url: site.domain, changeFrequency: 'weekly' },
    ...servicePages,
    ...countyHubs,
    { url: `${site.domain}/cost-guides/loft-conversion-cost`, changeFrequency: 'monthly' },
    { url: `${site.domain}/blog`, changeFrequency: 'weekly' },
    ...blogPages,
    { url: `${site.domain}/contact`, changeFrequency: 'yearly' },
    ...locationPages,
  ];
}
