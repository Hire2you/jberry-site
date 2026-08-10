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
  heading = 'Before and after',
  intro = 'Genuine J.Berry loft conversions, shown as they were and as they finished. More pairs added as each job is photographed.',
}: {
  pairs?: BeforeAfterPair[];
  heading?: string;
  intro?: string;
}) {
  if (!pairs.length) {
    return (
      <div className="border border-dashed border-line bg-white/50 px-6 py-10 text-center">
        <p className="eyebrow">Coming soon</p>
        <h3 className="mt-3 font-display text-2xl">{heading}</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone">{intro}</p>
        <p className="mt-4 text-xs text-stone">
          Structure ready. Add before-and-after pairs when genuine loft photos are available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Reveal>
        <p className="eyebrow">Transformation</p>
        <h3 className="mt-3 text-3xl md:text-4xl">{heading}</h3>
        <p className="mt-3 max-w-2xl text-stone leading-relaxed">{intro}</p>
        <p className="mt-2 text-xs uppercase tracking-eyebrow text-goldDeep">Drag the slider to compare</p>
      </Reveal>
      <div className={`mt-10 grid gap-10 ${pairs.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {pairs.map((pair, i) => (
          <Reveal key={pair.id} delay={i * 80}>
            <article>
              {(pair.title || pair.location) && (
                <p className="mb-4 text-sm font-semibold uppercase tracking-eyebrow text-ink">
                  {pair.title}
                  {pair.location && (
                    <span className="font-normal normal-case tracking-normal text-stone">
                      {' '}
                      · {pair.location}
                    </span>
                  )}
                </p>
              )}
              <BeforeAfterSlider before={pair.before} after={pair.after} className="border border-line shadow-[0_16px_48px_rgba(26,23,20,0.08)]" />
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
