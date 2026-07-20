export default function Captioned({ caption, children, className = '' }: {
  caption: string; children: React.ReactNode; className?: string;
}) {
  return (
    <figure className={className}>
      {children}
      <figcaption className="mt-2 text-[11px] font-semibold uppercase tracking-eyebrow text-stone">
        {caption}
      </figcaption>
    </figure>
  );
}
