import {defineQuery} from 'next-sanity'

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    category,
    author,
    coverImage,
    "plainText": pt::text(body)
  }
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    publishedAt,
    category,
    author,
    coverImage,
    body,
    "plainText": pt::text(body)
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`)

export const FEATURED_TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && featured == true] | order(customerName asc) {
    _id,
    quote,
    "name": customerName,
    location,
    "project": projectType,
    "highlight": highlightTag,
    category,
    featured
  }
`)

export const TESTIMONIALS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "testimonial" && category == $category] | order(customerName asc) {
    _id,
    quote,
    "name": customerName,
    location,
    "project": projectType,
    "highlight": highlightTag,
    category,
    featured
  }
`)

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(displayOrder asc) {
    _id,
    title,
    location,
    projectType,
    subType,
    mainImage,
    featured,
    displayOrder
  }
`)

export const PROJECTS_BY_TYPE_QUERY = defineQuery(`
  *[_type == "project" && projectType == $projectType] | order(displayOrder asc) {
    _id,
    title,
    location,
    projectType,
    subType,
    mainImage,
    featured,
    displayOrder
  }
`)

export const LOCATION_PAGES_BY_SERVICE_QUERY = defineQuery(`
  *[_type == "locationPage" && active == true && (serviceType == $serviceType || serviceType == "both")] | order(town asc) {
    _id,
    town,
    county,
    serviceType,
    slug,
    active
  }
`)

export const LOCATION_PAGE_QUERY = defineQuery(`
  *[_type == "locationPage" && (serviceType == $serviceType || serviceType == "both") && (
    slug == $location ||
    slug == ("/" + $location) ||
    slug == ("/extensions/" + $location) ||
    slug == ("/loft-conversions/" + $location)
  )][0] {
    _id,
    town,
    county,
    serviceType,
    slug,
    active,
    seoTitle,
    seoDescription,
    sections[] {
      ...,
      _type == "heroBlock" => {
        ...,
        backgroundImage
      },
      _type == "introTextBlock" => {
        ...,
        image
      },
      _type == "textAndImageBlock" => {
        ...,
        image
      }
    }
  }
`)

export const LOCATION_PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "locationPage" && (serviceType == $serviceType || serviceType == "both") && defined(slug)]{
    slug,
    serviceType
  }
`)

export const PROJECTS_FOR_LOCATION_QUERY = defineQuery(`
  *[
    _type == "project" &&
    ($serviceType == "both" || projectType == $serviceType) &&
    (
      location == $town ||
      location match ("*" + $town + "*") ||
      location match ("*" + $county + "*") ||
      featured == true
    )
  ] | order(displayOrder asc) [0...8] {
    _id,
    title,
    location,
    projectType,
    subType,
    mainImage,
    featured,
    displayOrder
  }
`)
