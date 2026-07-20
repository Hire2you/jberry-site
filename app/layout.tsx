import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import StickyCallBar from '@/components/StickyCallBar';
import { site } from '@/lib/site';

const display = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-display', axes: ['SOFT', 'WONK', 'opsz'] });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: `${site.name} | Extensions & Loft Conversions, London, Kent & Essex`, template: `%s | ${site.name}` },
  description: `Director-led extensions and loft conversions across London, Kent and Essex. Detailed quotations, the price we quote is the price you pay.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppWidget />
        <StickyCallBar />
      </body>
    </html>
  );
}
