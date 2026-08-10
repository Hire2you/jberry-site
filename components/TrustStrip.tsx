import ReviewsBadges from '@/components/ReviewsBadges';

const defaultItems = [
  { label: 'Over 100 loft conversions completed' },
  { label: 'Fully insured · 10-year guarantee' },
];

export default function TrustStrip({
  condensed = false,
  showReviews = true,
  items = defaultItems,
}: {
  condensed?: boolean;
  showReviews?: boolean;
  items?: { label: string }[];
}) {
  if (condensed) {
    return (
      <div className="border border-line bg-ivory px-5 py-4">
        <ul className="flex flex-col gap-2 text-sm text-ink sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        {showReviews && (
          <div className="mt-3">
            <ReviewsBadges condensed />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-y border-line bg-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:py-6">
        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm text-ink">
              <span className="h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>
        {showReviews && <ReviewsBadges condensed />}
      </div>
    </div>
  );
}
