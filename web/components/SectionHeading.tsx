export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-clay-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-clay-600">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-ink-800/70">{description}</p>}
    </div>
  );
}
