import Image from 'next/image'
import Reveal from '@/components/Reveal'
import {urlFor} from '@/sanity/image'
import type {LocationSection} from '@/lib/location-page'

export default function LocationTextAndImage({
  block,
}: {
  block: Extract<LocationSection, {_type: 'textAndImageBlock'}>
}) {
  const imageLeft = block.imagePosition === 'left'
  const src = block.image
    ? urlFor(block.image).width(1400).height(1000).fit('crop').url()
    : '/images/placeholder.webp'

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${imageLeft ? '' : ''}`}
        >
          <Reveal>
            <div className={imageLeft ? 'lg:order-2' : ''}>
              <h2 className="text-4xl md:text-5xl">{block.headline}</h2>
              {block.body && (
                <p className="mt-5 text-stone leading-relaxed whitespace-pre-line">{block.body}</p>
              )}
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
