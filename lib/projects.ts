import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/image'

export type ProjectMainImage = SanityImageSource & {
  alt?: string
}

export type SanityProject = {
  _id: string
  title: string
  location: string
  projectType: 'extension' | 'loft-conversion'
  subType?: string
  mainImage?: ProjectMainImage | null
  featured?: boolean
  displayOrder?: number
}

/** Slide shape used by ProjectCarousel (matches the previous hardcoded slides). */
export type CarouselSlide = {
  _id: string
  src: string
  alt: string
  title: string
  location: string
}

export function toCarouselSlides(projects: SanityProject[]): CarouselSlide[] {
  return projects.map((project) => {
    const src = project.mainImage
      ? urlFor(project.mainImage).width(1200).height(800).fit('crop').url()
      : '/images/placeholder.webp'

    return {
      _id: project._id,
      title: project.title,
      location: project.location,
      src,
      alt: project.mainImage?.alt || project.title,
    }
  })
}
