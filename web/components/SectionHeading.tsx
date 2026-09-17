export default function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="scrim font-display text-2xl font-bold tracking-tight text-qor-50 sm:text-3xl">{title}</h2>
      {description && <p className="scrim mt-3 text-base leading-relaxed text-qor-100/85">{description}</p>}
    </div>
  );
}
