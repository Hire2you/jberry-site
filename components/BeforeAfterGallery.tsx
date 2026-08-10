import Reveal from '@/components/Reveal';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

export type BeforeAfterPair = {
  id: string;
  title: string;
  location?: string;
  before: { src: string; alt: string };
  after: { src: string; alt: string };
};

/**
 * Before-and-after gallery, populated over time from genuine J.Berry loft photography only.
 * Capture before / during / after on every future job.
 */
export default function BeforeAfterGallery({
  pairs = [],
  ctaLabel = 'Get your itemised quote',
}: {
  pairs?: BeforeAfterPair[];
  ctaLabel?: string;
}) {
  if (!pairs.length) {
    return (
      <div className="mx-auto max-w-2xl border border-dashed border-line bg-white/50 px-6 py-10 text-center">
        <p className="eyebrow">Coming soon</p>
        <h3 className="mt-3 font-display text-2xl">Before and after</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone">
          Genuine J.Berry loft conversions, shown as they were and as they finished. More pairs added as
          each job is photographed.
        </p>
      </div>
    );
  }

  const single = pairs.length === 1;

  return (
    <div>
      <div className={`grid gap-8 ${single ? 'mx-auto max-w-2xl' : 'md:grid-cols-2'}`}>
        {pairs.map((pair, i) => (
          <Reveal key={pair.id} delay={i * 80}>
            <article>
              <BeforeAfterSlider
                before={pair.before}
                after={pair.after}
                className="border border-line shadow-[0_16px_48px_rgba(26,23,20,0.08)]"
              />
              {(pair.title || pair.location) && (
                <p className="mt-3 text-xs font-semibold uppercase tracking-eyebrow text-stone">
                  {pair.title}
                  {pair.location && <span className="font-normal normal-case tracking-normal"> · {pair.location}</span>}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={pairs.length * 80}>
        <div className="mt-10 text-center">
          <a
            href="#quote"
            className="inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
          >
            {ctaLabel}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
