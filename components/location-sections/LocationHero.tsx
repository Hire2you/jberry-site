import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {LocationSection} from '@/lib/location-page'
import {
  SectionButton,
  resolveAlignment,
  resolvePadding,
  resolveTheme,
  sectionAlignClass,
  sectionButtonClassName,
  sectionTone,
} from '@/components/location-sections/sectionSettings'

export default function LocationHero({
  block,
  headingAs = 'h1',
}: {
  block: Extract<LocationSection, {_type: 'heroBlock'}>
  headingAs?: 'h1' | 'h2'
}) {
  const Heading = headingAs
  const src = block.backgroundImage
    ? urlFor(block.backgroundImage).width(2400).height(1400).fit('crop').url()
    : '/images/placeholder.webp'
  const alt = block.backgroundImage?.alt || block.headline
  const theme = resolveTheme(block.theme, 'dark')
  const align = resolveAlignment(block.textAlignment)
  const padding = resolvePadding(block.paddingSize)
  const tone = sectionTone(theme)
  const fade =
    theme === 'cream' ? 'bg-ivory' : theme === 'light' ? 'bg-white' : 'bg-band'
  const contentPad =
    padding === 'none'
      ? 'pb-8 pt-16 md:pt-20'
      : padding === 'large'
        ? 'pb-20 pt-[5.5rem] md:pb-24 md:pt-36'
        : 'pb-14 pt-[4.5rem] md:pt-28'

  const showSectionButton = Boolean(block.showButton && block.buttonText && block.buttonLink)
  const showLegacyCta = Boolean(block.ctaText && block.ctaLink && !showSectionButton)

  return (
    <section className={`relative overflow-hidden ${tone.section}`}>
      <div className="relative flex min-h-[64svh] w-full flex-col justify-end md:min-h-[min(calc(72vh-40px),520px)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={headingAs === 'h1'}
          fetchPriority={headingAs === 'h1' ? 'high' : undefined}
          quality={70}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-band from-[10%] via-black/75 via-[50%] to-black/45" />
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 ${fade} md:h-24`}
          aria-hidden="true"
        />
        <div className="relative z-[2]">
          <div
            className={`mx-auto w-full max-w-6xl px-4 ${contentPad} ${sectionAlignClass(align)}`}
          >
            <Heading
              className={`mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)] ${align === 'center' ? 'mx-auto' : ''}`}
            >
              {block.headline}
            </Heading>
            {block.subheading && (
              <p
                className={`mt-4 max-w-xl text-white/85 ${align === 'center' ? 'mx-auto' : ''}`}
              >
                {block.subheading}
              </p>
            )}
            {showLegacyCta && (
              <div className={`mt-7 ${align === 'center' ? 'flex justify-center' : ''}`}>
                <a href={block.ctaLink!} className={sectionButtonClassName}>
                  {block.ctaText}
                </a>
              </div>
            )}
            <SectionButton
              showButton={block.showButton}
              buttonText={block.buttonText}
              buttonLink={block.buttonLink}
              align={align}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
