import type {PortableTextBlock} from 'next-sanity'
import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/image'

export type SanityCoverImage = SanityImageSource & {
  alt?: string
}

export type BlogPostListItem = {
  _id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  category?: string
  author?: string
  coverImage?: SanityCoverImage | null
  plainText?: string | null
}

export type BlogPost = BlogPostListItem & {
  body?: PortableTextBlock[] | null
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function readingMinutes(plainText?: string | null) {
  const words = (plainText || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function coverImageUrl(image?: SanityCoverImage | null, width = 1600, height = 1000) {
  if (!image) return '/images/placeholder.webp'
  return urlFor(image).width(width).height(height).fit('crop').url()
}

export function coverImageAlt(image?: SanityCoverImage | null, fallback = '') {
  return image?.alt || fallback
}
