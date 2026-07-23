import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import Reveal from '@/components/Reveal'
import {urlFor} from '@/sanity/image'
import type {LocationSection} from '@/lib/location-page'
import {
  SectionButton,
  resolveAlignment,
  resolvePadding,
  resolveTheme,
  sectionAlignClass,
  sectionPaddingClass,
  sectionTone,
} from '@/components/location-sections/sectionSettings'

export default function LocationTextAndImage({
  block,
}: {
  block: Extract<LocationSection, {_type: 'textAndImageBlock'}>
}) {
  const imageLeft = stegaClean(block.imagePosition) === 'left'
  const src = block.image
    ? urlFor(block.image).width(1400).height(1000).fit('crop').url()
    : '/images/placeholder.webp'
  const theme = resolveTheme(block.theme, 'light')
  const align = resolveAlignment(block.textAlignment)
  const padding = resolvePadding(block.paddingSize)
  const tone = sectionTone(theme)

  return (
    <section className={`relative ${tone.section}`}>
      <div
        className={`mx-auto max-w-6xl px-4 ${sectionPaddingClass(padding)} ${sectionAlignClass(align)}`}
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className={imageLeft ? 'lg:order-2' : ''}>
              <h2 className={`text-4xl md:text-5xl ${tone.heading}`}>{block.headline}</h2>
              {block.body && (
                <p className={`mt-5 leading-relaxed whitespace-pre-line ${tone.body}`}>
                  {block.body}
                </p>
              )}
              <SectionButton
                showButton={block.showButton}
                buttonText={block.buttonText}
                buttonLink={block.buttonLink}
                align={align}
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className={`img-zoom relative aspect-[4/3] ${imageLeft ? 'lg:order-1' : ''}`}>
              <Image
                src={src}
                alt={block.image?.alt || block.headline}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
