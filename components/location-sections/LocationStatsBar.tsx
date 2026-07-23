import GoldPattern from '@/components/GoldPattern'
import type {LocationSection} from '@/lib/location-page'

export default function LocationStatsBar({
  block,
}: {
  block: Extract<LocationSection, {_type: 'statsBarBlock'}>
}) {
  const stats = (block.stats || []).slice(0, 4)
  if (!stats.length) return null

  return (
    <div className="relative border-y border-line bg-ivory">
      <GoldPattern id={`lattice-stats-${block._key}`} />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 md:gap-8 md:px-4 md:py-8">
        {stats.map((stat, i) => (
          <div
            key={stat._key || stat.label}
            className={[
              'px-5 py-7 md:p-0',
              i % 2 === 1 ? 'border-l border-line md:border-l-0' : '',
              i > 1 ? 'border-t border-line md:border-t-0' : '',
            ].join(' ')}
          >
            <div className="mb-3 h-px w-8 bg-gold md:hidden" />
            <p className="font-display text-lg">{stat.label}</p>
            {stat.subtext && <p className="mt-1 text-sm text-stone">{stat.subtext}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
