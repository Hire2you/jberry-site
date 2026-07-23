import {stegaClean} from 'next-sanity'

export type SectionTheme = 'light' | 'dark' | 'cream'
export type TextAlignment = 'left' | 'center'
export type PaddingSize = 'normal' | 'large' | 'none'

export type SectionTone = {
  section: string
  heading: string
  body: string
  muted: string
  border: string
  panel: string
  panelText: string
  link: string
  goldAccent: string
}

const THEMES: Record<SectionTheme, SectionTone> = {
  light: {
    section: 'bg-white text-ink',
    heading: 'text-ink',
    body: 'text-stone',
    muted: 'text-stone',
    border: 'border-line',
    panel: 'border border-line bg-ivory',
    panelText: 'text-ink',
    link: 'font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep',
    goldAccent: 'text-gold',
  },
  cream: {
    section: 'bg-ivory text-ink',
    heading: 'text-ink',
    body: 'text-stone',
    muted: 'text-stone',
    border: 'border-line',
    panel: 'border border-line bg-white',
    panelText: 'text-ink',
    link: 'font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep',
    goldAccent: 'text-gold',
  },
  dark: {
    section: 'bg-band text-white',
    heading: 'text-white',
    body: 'text-white/85',
    muted: 'text-white/70',
    border: 'border-white/15',
    panel: 'border border-white/15 bg-charcoal',
    panelText: 'text-white',
    link: 'font-semibold text-gold underline decoration-gold underline-offset-4 hover:text-white',
    goldAccent: 'text-gold',
  },
}

export function resolveTheme(
  theme: string | null | undefined,
  fallback: SectionTheme = 'light',
): SectionTheme {
  const cleaned = stegaClean(theme)
  if (cleaned === 'light' || cleaned === 'dark' || cleaned === 'cream') return cleaned
  return fallback
}

export function resolveAlignment(
  align: string | null | undefined,
  fallback: TextAlignment = 'left',
): TextAlignment {
  return stegaClean(align) === 'center' ? 'center' : fallback
}

export function resolvePadding(
  size: string | null | undefined,
  fallback: PaddingSize = 'normal',
): PaddingSize {
  const cleaned = stegaClean(size)
  if (cleaned === 'large' || cleaned === 'none' || cleaned === 'normal') return cleaned
  return fallback
}

export function sectionTone(theme: SectionTheme): SectionTone {
  return THEMES[theme]
}

export function sectionPaddingClass(size: PaddingSize, compact = false): string {
  if (compact) {
    switch (size) {
      case 'none':
        return 'py-0'
      case 'large':
        return 'py-12 md:py-16'
      default:
        return 'py-7 md:py-8'
    }
  }
  switch (size) {
    case 'none':
      return 'py-0'
    case 'large':
      return 'py-28 md:py-32'
    default:
      return 'py-20'
  }
}

export function sectionAlignClass(align: TextAlignment): string {
  return align === 'center' ? 'text-center' : 'text-left'
}

/** Gold CTA matching the site hero / primary button style. */
export const sectionButtonClassName =
  'inline-block bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-white'

export function SectionButton({
  showButton,
  buttonText,
  buttonLink,
  align = 'left',
  className = 'mt-7',
}: {
  showButton?: boolean | null
  buttonText?: string | null
  buttonLink?: string | null
  align?: TextAlignment
  className?: string
}) {
  if (!showButton || !buttonText || !buttonLink) return null
  return (
    <div className={[className, align === 'center' ? 'flex justify-center' : ''].filter(Boolean).join(' ')}>
      <a href={buttonLink} className={sectionButtonClassName}>
        {buttonText}
      </a>
    </div>
  )
}
