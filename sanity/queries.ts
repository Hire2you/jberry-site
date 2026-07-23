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
