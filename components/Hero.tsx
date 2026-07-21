import Image from 'next/image';
import images from '@/data/images.json';
import { site } from '@/lib/site';

export default function Hero() {
  return (
    <section className="relative bg-band">
      {/* Content sits in normal flow so the hero can never be shorter than its text.
          min-h keeps a decent amount of photo visible; it's capped on desktop so tall screens don't get a huge empty hero. */}
      <div className="relative flex min-h-[64svh] w-full flex-col justify-end md:min-h-[min(calc(72vh-40px),520px)]">
        <Image src={images.hero.src} alt={images.hero.alt} fill priority sizes="100vw" className="object-cover" />
        {/* Near-black overlay so text is always readable. Bottom terminates in solid band so it blends into the carousel below. */}
        <div className="absolute inset-0 bg-gradient-to-t from-band from-[6%] via-black/75 via-[50%] to-black/45" />
        <div className="relative">
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-[4.5rem] md:pt-28">
            <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">London · Kent · Essex</p>
            <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              Extensions and loft conversions, designed and built with perfection
            </h1>
            <p className="mt-4 max-w-xl text-white/85">
              Director-led builds with detailed quotations, the price we quote is the price you pay.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#quote" className="bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-white">
                Get your detailed quote
              </a>
              <a href={site.phoneHref} className="border border-white/80 bg-charcoalDeep/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:border-gold hover:text-gold">
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
