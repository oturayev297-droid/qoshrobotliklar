import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import PersonCard from "@/components/PersonCard";
import EmptyState from "@/components/EmptyState";
import { getPeople } from "@/lib/api";

export const metadata: Metadata = {
  title: "Mashhur kishilar",
  description: "Qo'shrabot tumanidan yetishib chiqqan taniqli olimlar, san'atkorlar, sportchilar va tadbirkorlar.",
};

export default async function MashhurKishilarPage() {
  const people = await getPeople();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <PageHeader
        title="Taniqli qo'shrabotliklar"
        description="Ro'yxatni hamjamiyat to'ldiradi. Har bir profil moderator tekshiruvidan va manba bilan tasdiqlangandan keyin chiqadi."
      >
        <Link href="/mashhur-kishilar/taklif" className="btn-primary">
          Kishini taklif qilish
        </Link>
      </PageHeader>

      {people.length > 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          text="Hali tasdiqlangan profil yo'q. Qo'shrabotdan chiqqan olim, sportchi, san'atkor yoki tadbirkorni bilsangiz, birinchi bo'lib qo'shing."
          href="/mashhur-kishilar/taklif"
          cta="Kishini taklif qilish"
        />
      )}
    </div>
  );
}
