import Image from 'next/image'
import Reveal from '@/components/Reveal'
import {urlFor} from '@/sanity/image'
import type {LocationSection} from '@/lib/location-page'

export default function LocationIntroText({
  block,
}: {
  block: Extract<LocationSection, {_type: 'introTextBlock'}>
}) {
  const imageSrc = block.image
    ? urlFor(block.image).width(1600).height(900).fit('crop').url()
    : null

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
          <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{block.headline}</h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {block.leftText && <p className="text-stone leading-relaxed whitespace-pre-line">{block.leftText}</p>}
            {block.rightText && <p className="text-stone leading-relaxed whitespace-pre-line">{block.rightText}</p>}
          </div>
        </Reveal>
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
