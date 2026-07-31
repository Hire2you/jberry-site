'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

const navLinks = [
  { href: '/extensions', label: 'Extensions' },
  { href: '/loft-conversions', label: 'Loft conversions' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4">
        <Link href="/" aria-label="J.Berry Extensions & Conversions, home" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.webp"
            alt="J.Berry Extensions & Conversions"
            width={168}
            height={92}
            priority
            className="h-14 w-auto sm:h-16 lg:h-20"
          />
        </Link>

        {/* Full nav only from lg — tablets use the compact menu to avoid wrapping */}
        <nav className="hidden items-center gap-6 whitespace-nowrap text-sm lg:flex xl:gap-8" aria-label="Main">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? 'font-semibold text-goldDeep' : 'text-ink hover:text-goldDeep'}
            >
              {l.label}
            </Link>
          ))}
          <a href={site.phoneHref} className="text-ink hover:text-goldDeep">
            {site.phone}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={site.phoneHref}
            className="hidden whitespace-nowrap text-sm font-semibold text-ink hover:text-goldDeep md:inline-block lg:hidden"
          >
            {site.phone}
          </a>
          <a
            href="#quote"
            className="bg-charcoal px-4 py-2.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep sm:px-5"
          >
            Get a quote
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="site-nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center border border-line text-ink lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Compact menu for phone + tablet */}
      <div id="site-nav-menu" className={`border-t border-line bg-white lg:hidden ${open ? 'block' : 'hidden'}`}>
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2" aria-label="Site">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`border-b border-line py-4 text-sm ${pathname === l.href ? 'font-semibold text-goldDeep' : 'text-ink'}`}
            >
              {l.label}
            </Link>
          ))}
          <a href={site.phoneHref} onClick={() => setOpen(false)} className="py-4 text-sm font-semibold text-ink md:hidden">
            Call {site.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
