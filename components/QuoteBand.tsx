import { site } from '@/lib/site';
import LeadForm from '@/components/LeadForm';
import Reveal from '@/components/Reveal';

// Dark quote section with the lead form. `id="quote"` so the header CTA
// and sticky call bar anchors work on pages that include it.
export default function QuoteBand({
  eyebrow = 'Start your project',
  heading = 'Get your detailed quotation',
  text,
}: {
  eyebrow?: string;
  heading?: string;
  text?: string;
}) {
  return (
    <section id="quote" className="bg-charcoalDeep text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 text-4xl md:text-5xl">{heading}</h2>
          <p className="mt-5 text-white/70">
            {text ??
              `Tell us about your extension or loft conversion and ${site.director} will call you back, usually the same working day. Covering London, Kent and Essex.`}
          </p>
          <p className="mt-6 font-display text-2xl text-gold"><a href={site.phoneHref}>{site.phone}</a></p>
        </Reveal>
        <Reveal delay={120}><LeadForm dark /></Reveal>
      </div>
    </section>
  );
}
