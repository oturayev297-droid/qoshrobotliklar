// Ichki sahifalar sarlavhasi: 3D manzara ustida, matn orqasi yumshoq qoraytirilgan
export default function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute -inset-x-32 -inset-y-16 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(11,16,34,0.7),transparent_70%)]" />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="scrim font-display text-3xl font-bold leading-tight tracking-tight text-qor-50 sm:text-5xl">
            {title}
          </h1>
          {description && <p className="scrim mt-4 text-lg leading-relaxed text-qor-100/85">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
