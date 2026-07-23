import type {MetadataRoute} from 'next'
import services from '@/data/services.json'
import locations from '@/data/locations.json'
import {site} from '@/lib/site'
import {sanityFetch} from '@/sanity/live'
import {POST_SLUGS_QUERY} from '@/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const servicePages = services.map((s) => ({
    url: `${site.domain}/${s.slug}`,
    changeFrequency: 'weekly' as const,
  }))
  const locationPages = services.flatMap((s) =>
    locations.map((l) => ({
      url: `${site.domain}/${s.slug}/${l.slug}`,
      changeFrequency: 'monthly' as const,
    })),
  )

  const {data} = await sanityFetch({
    query: POST_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  const blogPages = ((data || []) as Array<{slug: string}>).map((post) => ({
    url: `${site.domain}/blog/${post.slug}`,
    changeFrequency: 'monthly' as const,
  }))

  const countyHubs = [{url: `${site.domain}/loft-conversions/essex`, changeFrequency: 'monthly' as const}]

  return [
    {url: site.domain, changeFrequency: 'weekly'},
    ...servicePages,
    ...countyHubs,
    {url: `${site.domain}/cost-guides/loft-conversion-cost`, changeFrequency: 'monthly'},
    {url: `${site.domain}/blog`, changeFrequency: 'weekly'},
    ...blogPages,
    {url: `${site.domain}/contact`, changeFrequency: 'yearly'},
    ...locationPages,
  ]
}
