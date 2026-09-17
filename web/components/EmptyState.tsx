import Link from "next/link";

export default function EmptyState({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-qor-50/20 bg-tun-950/[0.82] p-10 text-center">
      <p className="mx-auto max-w-md text-qor-300">{text}</p>
      {href && cta && (
        <Link href={href} className="btn-primary mt-6">
          {cta}
        </Link>
      )}
    </div>
  );
}
