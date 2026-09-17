import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PersonCard from "@/components/PersonCard";
import { getPeople } from "@/lib/api";

export const metadata: Metadata = {
  title: "Mashhur kishilar",
  description: "Qo'shrabot tumanidan yetishib chiqqan taniqli olimlar, san'atkorlar, sportchilar va tadbirkorlar.",
};

export default async function MashhurKishilarPage() {
  const people = await getPeople();

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Hamjamiyat kataloglagi"
          title="Taniqli qo'shrabotliklar"
          description="Bu ro'yxat hamjamiyat a'zolari tomonidan to'ldiriladi va moderatordan o'tgach chop etiladi. Har bir profil real manba bilan tasdiqlanadi."
        />
        <Link
          href="/mashhur-kishilar/taklif"
          className="rounded-full bg-clay-500 px-6 py-3 text-sm font-bold text-sand-50 shadow-soft hover:bg-clay-600"
        >
          + Kishi taklif qilish
        </Link>
      </div>

      {people.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-sand-300 bg-sand-100/50 p-14 text-center">
          <p className="text-3xl">👥</p>
          <p className="mx-auto mt-4 max-w-md text-ink-800/70">
            Hozircha tasdiqlangan profillar yo&#39;q. Qo&#39;shrabotdan chiqqan taniqli olim, sportchi,
            san&#39;atkor yoki tadbirkorni bilasizmi? Birinchi bo&#39;lib siz qo&#39;shing!
          </p>
          <Link
            href="/mashhur-kishilar/taklif"
            className="mt-6 inline-block rounded-full bg-clay-500 px-7 py-3 text-sm font-bold text-sand-50 hover:bg-clay-600"
          >
            Kishi taklif qilish
          </Link>
        </div>
      )}
    </div>
  );
}
