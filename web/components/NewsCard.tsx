import Link from "next/link";
import { NewsPost } from "@/lib/types";

export default function NewsCard({ post }: { post: NewsPost }) {
  const date = new Date(post.createdAt).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/yangiliklar/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-sand-50 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-clay-400 to-clay-600 text-sand-50">
        <span className="text-3xl opacity-40">📰</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-800/50">{date}</span>
        <h3 className="mt-2 font-display text-lg font-bold text-ink-900 group-hover:text-clay-600">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-800/70">{post.excerpt}</p>
        <span className="mt-4 text-sm font-bold text-clay-600">To&#39;liq o&#39;qish →</span>
      </div>
    </Link>
  );
}
