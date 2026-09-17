import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";
import { getNews } from "@/lib/api";

export const metadata: Metadata = {
  title: "Yangiliklar",
  description: "Qo'shrabot tumanidan so'nggi yangiliklar va e'lonlar.",
};

export default async function YangiliklarPage() {
  const news = await getNews();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <PageHeader title="Tumandan so'nggi xabarlar" />

      {news.length > 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <NewsCard key={n.id} post={n} />
          ))}
        </div>
      ) : (
        <EmptyState text="Hozircha yangilik chop etilmagan. Tez orada shu yerda tumandan xabarlar paydo bo'ladi." />
      )}
    </div>
  );
}
