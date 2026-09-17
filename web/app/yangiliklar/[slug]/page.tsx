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
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <Link href="/yangiliklar" className="link scrim text-sm">
        Barcha yangiliklar
      </Link>
      <div className="panel mt-6 p-7 sm:p-12">
        <time dateTime={post.createdAt} className="text-sm text-qor-500">
          {date}
        </time>
        <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-qor-50 sm:text-4xl">{post.title}</h1>
        <div className="mt-8 max-w-prose whitespace-pre-wrap text-base leading-relaxed text-qor-100/90">
          {post.content}
        </div>
      </div>
    </article>
  );
}
