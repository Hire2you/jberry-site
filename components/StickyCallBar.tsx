import { site } from '@/lib/site';

export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden">
      <a href={site.phoneHref} className="bg-charcoal py-4 text-center text-xs font-semibold uppercase tracking-eyebrow text-white">
        Call {site.director}
      </a>
      <a href="#quote" className="bg-gold py-4 text-center text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep">
        Get a quote
      </a>
    </div>
  );
}
