import Reveal from '@/components/Reveal'
import SectionIndex from '@/components/SectionIndex'
import TestimonialShowcase from '@/components/TestimonialShowcase'
import type {Testimonial} from '@/lib/testimonials'
import type {LocationSection} from '@/lib/location-page'

export default function LocationTestimonials({
  block,
  testimonials,
}: {
  block: Extract<LocationSection, {_type: 'testimonialsBlock'}>
  testimonials: Testimonial[]
}) {
  if (!testimonials.length) return null

  return (
    <section className="relative border-y border-line bg-white">
      <SectionIndex label="Stories" />
      <div className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow">{block.eyebrow || 'Tell your story'}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">
              {block.headline || "In our clients' words"}
            </h2>
          </div>
          <div className="mt-10">
            <TestimonialShowcase testimonials={testimonials} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
