import process from '@/data/process.json';
import Reveal from '@/components/Reveal';
import SectionIndex from '@/components/SectionIndex';

export default function ProcessSection() {
  return (
    <section className="relative overflow-x-clip">
      <SectionIndex label="04 · Process" />
      <div className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">From first visit to handover</h2>
          <p className="mt-4 font-display italic text-lg text-stone">The same four steps on every project, run by the same person.</p>
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-4 md:gap-8">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 100}>
              {/* Title sits inside the numeral's lower third: 120px numeral -> pt-20, 170px -> pt-28 */}
              <div className="relative pt-20 md:pt-28">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 select-none font-display text-[120px] leading-none text-gold/20 md:text-[170px]"
                >
                  {p.step}
                </span>
                <h3 className="relative font-display text-xl">{p.title}</h3>
                <div className="mt-3 h-px w-10 bg-gold" />
                <p className="mt-3 text-sm leading-relaxed text-stone">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a
            href="#quote"
            className="inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
          >
            Start with a site visit
          </a>
        </div>
      </div>
    </section>
  );
}
