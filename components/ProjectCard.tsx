import Image from 'next/image';

export default function ProjectCard({ title, location, postcode, image, summary }: {
  title: string; location: string; postcode: string; image: string; summary: string;
}) {
  return (
    <article className="group">
      <div className="img-zoom relative aspect-[4/3] w-full">
        <Image src={image} alt={`${title}, ${location}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        <span className="absolute left-0 top-4 bg-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-eyebrow text-gold">
          {postcode}
        </span>
      </div>
      <h3 className="mt-4 text-xl">{title}</h3>
      <p className="text-sm font-semibold uppercase tracking-eyebrow text-stone">{location}</p>
      <p className="mt-2 text-sm text-stone">{summary}</p>
    </article>
  );
}
