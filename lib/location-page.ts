import type {SanityImageSource} from '@sanity/image-url'

export type LocationImage = SanityImageSource & {alt?: string}

export type SectionSettingsFields = {
  theme?: string | null
  showButton?: boolean | null
  buttonText?: string | null
  buttonLink?: string | null
  textAlignment?: string | null
  paddingSize?: string | null
}

export type LocationSection =
  | ({
      _key: string
      _type: 'heroBlock'
      headline: string
      subheading?: string
      backgroundImage?: LocationImage | null
      ctaText?: string
      ctaLink?: string
    } & SectionSettingsFields)
  | ({
      _key: string
      _type: 'introTextBlock'
      eyebrow?: string
      headline: string
      leftText?: string
      rightText?: string
      image?: LocationImage | null
    } & SectionSettingsFields)
  | ({
      _key: string
      _type: 'statsBarBlock'
      stats?: Array<{_key: string; label: string; subtext?: string}>
    } & SectionSettingsFields)
  | {_key: string; _type: 'projectCarouselBlock'}
  | ({
      _key: string
      _type: 'costSectionBlock'
      introText?: string
      priceLow?: string
      priceHigh?: string
      lineItems?: Array<{_key: string; label: string; price?: string}>
    } & SectionSettingsFields)
  | ({
      _key: string
      _type: 'faqAccordionBlock'
      heading?: string
      intro?: string
      faqs?: Array<{_key: string; question: string; answer: string}>
    } & SectionSettingsFields)
  | {
      _key: string
      _type: 'testimonialsBlock'
      eyebrow?: string
      headline?: string
    }
  | ({
      _key: string
      _type: 'ctaFormBlock'
      headline: string
      subheading?: string
    } & SectionSettingsFields)
  | ({
      _key: string
      _type: 'textAndImageBlock'
      headline: string
      body?: string
      image?: LocationImage | null
      imagePosition?: 'left' | 'right'
    } & SectionSettingsFields)

export type LocationPageDocument = {
  _id: string
  town: string
  county: string
  serviceType: 'extension' | 'loft-conversion' | 'both'
  slug: string
  active?: boolean
  seoTitle?: string
  seoDescription?: string
  sections?: LocationSection[] | null
}

import {stegaClean} from 'next-sanity'

export function normalizeLocationSlug(slug: string) {
  const raw = stegaClean(slug).trim()
  if (!raw.startsWith('/')) return raw.replace(/^\/+/, '')
  const parts = raw.split('/').filter(Boolean)
  return parts[parts.length - 1] || raw
}

export function locationMatchesParam(docSlug: string, locationParam: string) {
  const param = stegaClean(locationParam).replace(/^\/+/, '')
  const cleanedDocSlug = stegaClean(docSlug)
  const normalized = normalizeLocationSlug(cleanedDocSlug)
  return (
    cleanedDocSlug === param ||
    cleanedDocSlug === `/${param}` ||
    normalized === param ||
    cleanedDocSlug.endsWith(`/${param}`)
  )
}
