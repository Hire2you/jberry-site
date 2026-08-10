import Image from 'next/image';

function Stars({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${label}: 5 out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#B08D3E"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M12 2l2.94 6.26 6.87.87-5.05 4.73 1.3 6.79L12 17.31l-6.06 3.34 1.3-6.79L2.19 9.13l6.87-.87z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewPill({
  href,
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  name,
}: {
  href?: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  name: string;
}) {
  const inner = (
    <>
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={logoWidth}
        height={logoHeight}
        className="h-6 w-6 object-contain"
      />
      <span className="text-sm font-medium text-ink">{name}</span>
      <Stars label={name} />
    </>
  );

  const className =
    'inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]';

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}

/**
 * Google and Checkatrade review badges (pill UI).
 * Swap hrefs / embed live widgets when official review links are ready.
 */
export default function ReviewsBadges({ condensed = false }: { condensed?: boolean }) {
  return (
    <div
      className={
        condensed
          ? 'flex flex-wrap items-center gap-3'
          : 'flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4'
      }
    >
      <ReviewPill
        logoSrc="/images/badges/google.png"
        logoAlt=""
        logoWidth={24}
        logoHeight={24}
        name="Google"
      />
      <ReviewPill
        logoSrc="/images/badges/checkatrade.png"
        logoAlt=""
        logoWidth={24}
        logoHeight={24}
        name="Checkatrade"
      />
    </div>
  );
}
