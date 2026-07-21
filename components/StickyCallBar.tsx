import { site } from '@/lib/site';

export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden">
      <a href={site.phoneHref} className="flex min-h-[3.75rem] items-center justify-center bg-charcoal px-2 py-5 text-center text-sm font-semibold uppercase tracking-eyebrow text-white">
        Call {site.director}
      </a>
      <a href="#quote" className="flex min-h-[3.75rem] items-center justify-center bg-gold px-2 py-5 text-center text-sm font-semibold uppercase tracking-eyebrow text-charcoalDeep">
        Get a quote
      </a>
    </div>
  );
}
