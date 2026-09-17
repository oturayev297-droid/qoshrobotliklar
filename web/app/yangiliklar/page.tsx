import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/api";

export const metadata: Metadata = {
  title: "Yangiliklar",
  description: "Qo'shrabot tumanidan so'nggi yangiliklar va e'lonlar.",
};

export default async function YangiliklarPage() {
  const news = await getNews();

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading eyebrow="Yangiliklar" title="Tumandan so'nggi xabarlar" />

      {news.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <NewsCard key={n.id} post={n} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-sand-300 bg-sand-100/50 p-14 text-center">
          <p className="text-3xl">📰</p>
          <p className="mx-auto mt-4 max-w-md text-ink-800/70">
            Hozircha yangiliklar chop etilmagan. Admin panel orqali birinchi maqolani qo&#39;shishingiz
            mumkin.
          </p>
        </div>
      )}
    </div>
  );
}
