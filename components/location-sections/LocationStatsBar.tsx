import GoldPattern from '@/components/GoldPattern'
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

export default function LocationStatsBar({
  block,
}: {
  block: Extract<LocationSection, {_type: 'statsBarBlock'}>
}) {
  const stats = (block.stats || []).slice(0, 4)
  if (!stats.length) return null

  const theme = resolveTheme(block.theme, 'cream')
  const align = resolveAlignment(block.textAlignment)
  const padding = resolvePadding(block.paddingSize)
  const tone = sectionTone(theme)
  const showPattern = theme !== 'dark'

  return (
    <div className={`relative border-y ${tone.border} ${tone.section}`}>
      {showPattern && <GoldPattern id={`lattice-stats-${block._key}`} />}
      <div
        className={`relative z-10 mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 md:gap-8 md:px-4 ${sectionPaddingClass(padding, true)} ${sectionAlignClass(align)}`}
      >
        {stats.map((stat, i) => (
          <div
            key={stat._key || stat.label}
            className={[
              'px-5 py-7 md:p-0',
              i % 2 === 1 ? `border-l ${tone.border} md:border-l-0` : '',
              i > 1 ? `border-t ${tone.border} md:border-t-0` : '',
            ].join(' ')}
          >
            <div className="mb-3 h-px w-8 bg-gold md:hidden" />
            <p className={`font-display text-lg ${tone.heading}`}>{stat.label}</p>
            {stat.subtext && <p className={`mt-1 text-sm ${tone.muted}`}>{stat.subtext}</p>}
          </div>
        ))}
      </div>
      <SectionButton
        showButton={block.showButton}
        buttonText={block.buttonText}
        buttonLink={block.buttonLink}
        align={align}
        className="relative z-10 mx-auto max-w-6xl px-4 pb-8"
      />
    </div>
  )
}
