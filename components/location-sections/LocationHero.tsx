import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {LocationSection} from '@/lib/location-page'

export default function LocationHero({
  block,
}: {
  block: Extract<LocationSection, {_type: 'heroBlock'}>
}) {
  const src = block.backgroundImage
    ? urlFor(block.backgroundImage).width(2400).height(1400).fit('crop').url()
    : '/images/placeholder.webp'
  const alt = block.backgroundImage?.alt || block.headline

  return (
    <section className="relative overflow-hidden bg-band">
      <div className="relative flex min-h-[64svh] w-full flex-col justify-end md:min-h-[min(calc(72vh-40px),520px)]">
        <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-band from-[10%] via-black/75 via-[50%] to-black/45" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-band md:h-24" aria-hidden="true" />
        <div className="relative z-[2]">
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-[4.5rem] md:pt-28">
            <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              {block.headline}
            </h1>
            {block.subheading && (
              <p className="mt-4 max-w-xl text-white/85">{block.subheading}</p>
            )}
            {block.ctaText && block.ctaLink && (
              <div className="mt-7">
                <a
                  href={block.ctaLink}
                  className="bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-white"
                >
                  {block.ctaText}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
