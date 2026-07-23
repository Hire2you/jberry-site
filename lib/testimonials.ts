export type Testimonial = {
  _id?: string
  quote: string
  name: string
  location?: string
  project: string
  highlight?: string
  category?: 'extension' | 'loft-conversion' | 'general'
  featured?: boolean
}
