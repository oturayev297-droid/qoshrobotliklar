import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/api";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getNewsBySlug(params.slug);
  if (!post) return { title: "Yangilik topilmadi" };
  return { title: post.title, description: post.excerpt };
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = await getNewsBySlug(params.slug);
  if (!post) notFound();

  const date = new Date(post.createdAt).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <Link href="/yangiliklar" className="text-sm font-bold text-clay-600 hover:text-clay-700">
        ← Yangiliklarga qaytish
      </Link>
      <span className="mt-6 block text-xs font-semibold uppercase tracking-wide text-ink-800/50">
        {date}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">{post.title}</h1>
      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap text-base leading-relaxed text-ink-800/85">
        {post.content}
      </div>
    </article>
  );
}
