import Link from "next/link";
import { NewsPost } from "@/lib/types";

export default function NewsCard({ post }: { post: NewsPost }) {
  const date = new Date(post.createdAt).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/yangiliklar/${post.slug}`} className="tile group flex flex-col p-6 hover:border-zar-400/40">
      <time dateTime={post.createdAt} className="text-sm text-qor-500">
        {date}
      </time>
      <h3 className="mt-2 font-display text-base font-bold leading-snug text-qor-50 group-hover:text-zar-300">
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-qor-300">{post.excerpt}</p>
    </Link>
  );
}
