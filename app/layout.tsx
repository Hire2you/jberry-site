import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidgetLazy from '@/components/WhatsAppWidgetLazy';
import StickyCallBar from '@/components/StickyCallBar';
import DisableDraftMode from '@/components/DisableDraftMode';
import GoogleAds from '@/components/GoogleAds';
import { site } from '@/lib/site';
import { SanityLive } from '@/sanity/live';

const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: true,
});
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: true,
});

const defaultTitle = `${site.name} | Extensions & Loft Conversions, Hertfordshire & Essex`;
const defaultDescription =
  'Director-led extensions and loft conversions across Hertfordshire and Essex. Itemised fixed-price quotations, 10% deposit then stages, with a 10-year guarantee.';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: defaultDescription,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: site.domain,
    siteName: site.name,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/images/hero-rear-extension.webp',
        width: 2400,
        height: 1600,
        alt: 'Full-width rear extension with anthracite bifold doors',
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <GoogleAds />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppWidgetLazy />
        <StickyCallBar />
        {isDraftMode && (
          <>
            <SanityLive />
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
