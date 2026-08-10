/**
 * Placeholder for live Google Reviews and Checkatrade badges.
 * Must be wired to official widgets / embeds before launch. Do not hard-code star counts.
 */
export default function ReviewsBadges({ condensed = false }: { condensed?: boolean }) {
  return (
    <div
      className={
        condensed
          ? 'flex flex-wrap items-center gap-4'
          : 'flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8'
      }
      data-reviews-badges="placeholder"
    >
      <div
        className="flex min-h-[48px] min-w-[140px] items-center justify-center border border-dashed border-line bg-white/60 px-4 py-2 text-center text-xs text-stone"
        aria-label="Google reviews widget placeholder"
      >
        {/* TODO: embed live Google reviews widget */}
        Google reviews
        <span className="sr-only"> (live widget to be connected)</span>
      </div>
      <div
        className="flex min-h-[48px] min-w-[140px] items-center justify-center border border-dashed border-line bg-white/60 px-4 py-2 text-center text-xs text-stone"
        aria-label="Checkatrade badge placeholder"
      >
        {/* TODO: embed official Checkatrade badge */}
        Checkatrade
        <span className="sr-only"> (official badge to be connected)</span>
      </div>
    </div>
  );
}
