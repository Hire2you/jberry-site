import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="J.Berry Extensions & Conversions, home">
          <Image src="/images/logo.webp" alt="J.Berry Extensions & Conversions" width={168} height={92} priority className="h-16 w-auto md:h-20" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Main">
          <Link href="/extensions/bishops-stortford" className="text-ink hover:text-goldDeep">Extensions</Link>
          <Link href="/loft-conversions/bishops-stortford" className="text-ink hover:text-goldDeep">Loft conversions</Link>
          <Link href="/cost-guides/loft-conversion-cost" className="text-ink hover:text-goldDeep">Cost guides</Link>
          <a href={site.phoneHref} className="text-ink hover:text-goldDeep">{site.phone}</a>
        </nav>
        <a href="#quote" className="bg-charcoal px-5 py-2.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
          Get a quote
        </a>
      </div>
    </header>
  );
}
