import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';

const footerLinks = [
  { href: '/extensions', label: 'House extensions' },
  { href: '/loft-conversions', label: 'Loft conversions' },
  { href: '/cost-guides/loft-conversion-cost', label: 'Loft conversion cost guide' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact us' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoalDeep pb-14 text-white/70 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-sm md:grid-cols-4">
        <div>
          <Image src="/images/logo-white.webp" alt="J.Berry Extensions & Conversions" width={1024} height={563} className="h-16 w-auto mix-blend-screen" />
          <p className="mt-4">Elegance in construction &amp; design. Director-led extensions and loft conversions from {site.base}.</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-3 space-y-2">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Areas covered</p>
          <p className="mt-3 leading-relaxed">{site.areaServed.join(' · ')}</p>
        </div>
        <div>
          <p className="eyebrow">Talk to {site.director}</p>
          <p className="mt-3"><a href={site.phoneHref} className="text-white hover:text-gold">{site.phone}</a></p>
          <p className="mt-1"><a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a></p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} {site.name}</div>
    </footer>
  );
}
