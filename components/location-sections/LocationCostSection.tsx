import Reveal from '@/components/Reveal'
import type {LocationSection} from '@/lib/location-page'

export default function LocationCostSection({
  block,
}: {
  block: Extract<LocationSection, {_type: 'costSectionBlock'}>
}) {
  const items = block.lineItems || []

  return (
    <section className="relative border-y border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">What it costs</p>
            {(block.priceLow || block.priceHigh) && (
              <h2 className="mt-3 text-4xl md:text-5xl">
                {block.priceLow}
                {block.priceLow && block.priceHigh ? ' – ' : ''}
                {block.priceHigh}
              </h2>
            )}
            {block.introText && (
              <p className="mt-5 text-stone leading-relaxed whitespace-pre-line">{block.introText}</p>
            )}
          </Reveal>
          <Reveal delay={100}>
            <div className="border border-line bg-ivory p-6 md:p-8">
              <p className="eyebrow">Sample quotation</p>
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={item._key || item.label} className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                    <p className="text-sm text-ink">{item.label}</p>
                    {item.price && <p className="text-sm font-semibold text-ink">{item.price}</p>}
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
