import { site } from '@/lib/site';

/** Fixed bottom call / quote bar — mobile only. Footer uses pb-20 so content clears it. */
export default function StickyCallBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="navigation"
      aria-label="Quick contact"
    >
      <a
        href={site.phoneHref}
        className="flex min-h-[3.75rem] items-center justify-center bg-charcoal px-2 py-5 text-center text-sm font-semibold uppercase tracking-eyebrow text-white"
      >
        Call {site.director}
      </a>
      <a
        href="#quote"
        className="flex min-h-[3.75rem] items-center justify-center bg-gold px-2 py-5 text-center text-sm font-semibold uppercase tracking-eyebrow text-charcoalDeep"
      >
        Get a quote
      </a>
    </div>
  );
}
