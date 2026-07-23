import Reveal from '@/components/Reveal'
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

export default function LocationCostSection({
  block,
}: {
  block: Extract<LocationSection, {_type: 'costSectionBlock'}>
}) {
  const items = block.lineItems || []
  const theme = resolveTheme(block.theme, 'light')
  const align = resolveAlignment(block.textAlignment)
  const padding = resolvePadding(block.paddingSize)
  const tone = sectionTone(theme)

  return (
    <section className={`relative border-y ${tone.border} ${tone.section}`}>
      <div
        className={`mx-auto max-w-6xl px-4 ${sectionPaddingClass(padding)} ${sectionAlignClass(align)}`}
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">What it costs</p>
            {(block.priceLow || block.priceHigh) && (
              <h2 className={`mt-3 text-4xl md:text-5xl ${tone.heading}`}>
                {block.priceLow}
                {block.priceLow && block.priceHigh ? ' – ' : ''}
                {block.priceHigh}
              </h2>
            )}
            {block.introText && (
              <p className={`mt-5 leading-relaxed whitespace-pre-line ${tone.body}`}>
                {block.introText}
              </p>
            )}
            <SectionButton
              showButton={block.showButton}
              buttonText={block.buttonText}
              buttonLink={block.buttonLink}
              align={align}
            />
          </Reveal>
          <Reveal delay={100}>
            <div className={`${tone.panel} p-6 md:p-8`}>
              <p className="eyebrow">Sample quotation</p>
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item._key || item.label}
                    className={`flex items-baseline justify-between gap-4 border-b pb-3 ${tone.border}`}
                  >
                    <p className={`text-sm ${tone.panelText}`}>{item.label}</p>
                    {item.price && (
                      <p className={`text-sm font-semibold ${tone.panelText}`}>{item.price}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
