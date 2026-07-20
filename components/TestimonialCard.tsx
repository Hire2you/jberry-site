export default function TestimonialCard({ name, location, project, quote, highlight }: {
  name: string; location: string; project: string; quote: string; highlight?: string;
}) {
  return (
    <figure className="border border-line bg-white p-8">
      <div className="gold-rule" />
      <blockquote className="mt-5 font-display text-lg leading-relaxed text-ink/90">&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="mt-5 text-sm text-stone">
        <span className="font-semibold uppercase tracking-eyebrow text-ink">{name}</span>
        {location && <>, {location}</>}
        {project && <><br />{project}</>}
      </figcaption>
      {highlight && <p className="mt-3 text-xs font-semibold uppercase tracking-eyebrow text-goldDeep">{highlight}</p>}
    </figure>
  );
}
