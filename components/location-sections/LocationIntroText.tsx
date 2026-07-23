import Image from 'next/image'
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

export default function LocationIntroText({
  block,
}: {
  block: Extract<LocationSection, {_type: 'introTextBlock'}>
}) {
  const imageSrc = block.image
    ? urlFor(block.image).width(1600).height(900).fit('crop').url()
    : null
  const theme = resolveTheme(block.theme, 'light')
  const align = resolveAlignment(block.textAlignment)
  const padding = resolvePadding(block.paddingSize)
  const tone = sectionTone(theme)

  return (
    <section className={`relative ${tone.section}`}>
      <div
        className={`mx-auto max-w-6xl px-4 ${sectionPaddingClass(padding)} ${sectionAlignClass(align)}`}
      >
        <Reveal>
          {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
          <h2
            className={`mt-3 max-w-3xl text-4xl md:text-5xl ${tone.heading} ${align === 'center' ? 'mx-auto' : ''}`}
          >
            {block.headline}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div
            className={`mt-8 grid gap-6 md:grid-cols-2 ${align === 'center' ? 'md:mx-auto' : ''}`}
          >
            {block.leftText && (
              <p className={`${tone.body} leading-relaxed whitespace-pre-line`}>{block.leftText}</p>
            )}
            {block.rightText && (
              <p className={`${tone.body} leading-relaxed whitespace-pre-line`}>{block.rightText}</p>
            )}
          </div>
        </Reveal>
        <SectionButton
          showButton={block.showButton}
          buttonText={block.buttonText}
          buttonLink={block.buttonLink}
          align={align}
        />
      </div>
      {imageSrc && (
        <div className="relative aspect-[21/9] w-full md:aspect-[3/1]">
          <Image
            src={imageSrc}
            alt={block.image?.alt || block.headline}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
    </section>
  )
}
