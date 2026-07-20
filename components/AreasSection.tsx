import areas from '@/data/areas.json';
import { site } from '@/lib/site';
import AreaMap from '@/components/AreaMap';
import Reveal from '@/components/Reveal';
import SectionIndex from '@/components/SectionIndex';

export default function AreasSection() {
  return (
    <section className="relative bg-charcoalDeep text-white">
      <SectionIndex label="06 · Areas" />
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <p className="eyebrow">Where we work</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Areas we cover</h2>
            <p className="mt-5 max-w-md text-white/70">
              Based in {site.base}, {site.director} and his team build across London, Kent and Essex —
              close enough for a site visit within days, not weeks.
            </p>

            <div className="mt-10 space-y-8">
              {areas.regions.map((r) => (
                <div key={r.name}>
                  <div className="flex items-baseline gap-4">
                    <h3 className="font-display text-2xl">{r.name}</h3>
                    <span className="text-xs uppercase tracking-eyebrow text-gold">{r.blurb}</span>
                  </div>
                  <div className="mt-2 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{r.towns.join(' · ')}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="#quote"
                className="inline-block bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-goldDeep hover:text-white"
              >
                Get your quote
              </a>
              <p className="mt-4 text-xs text-white/50">
                Outside these areas? Call {site.director} on{' '}
                <a href={site.phoneHref} className="text-white/80 underline decoration-gold/50 underline-offset-4 hover:text-gold">{site.phone}</a>
                {' '}— worth a conversation.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="-mx-4 lg:mx-0">
            <div className="relative border-y border-white/10 bg-white/[0.02] px-2 py-6 lg:border lg:p-6">
              <AreaMap />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
