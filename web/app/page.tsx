import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import StatCard from "@/components/StatCard";
import PersonCard from "@/components/PersonCard";
import PlaceCard from "@/components/PlaceCard";
import NewsCard from "@/components/NewsCard";
import { getDistrict, getNews, getPeople, getPlaces } from "@/lib/api";

export default async function HomePage() {
  const [district, people, places, news] = await Promise.all([
    getDistrict(),
    getPeople({ featured: true }),
    getPlaces({ featured: true }),
    getNews(),
  ]);

  return (
    <>
      <Hero />

      {/* Statistika */}
      <section className="mx-auto -mt-12 max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard value={district.population.total.toLocaleString("uz-UZ")} label="Aholi soni" />
          <StatCard value={`${district.areaKm2.toLocaleString("uz-UZ")} km²`} label="Maydoni" />
          <StatCard value={String(district.administrative.villages)} label="Qishloq" />
          <StatCard value={district.founded.split("-")[0]} label="Tashkil topgan yil" />
        </div>
      </section>

      {/* Temir Darvoza — hikoya bloki */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 rounded-3xl bg-deep-800 p-8 text-sand-50 shadow-soft md:grid-cols-2 md:p-12">
          <div>
            <span className="mb-4 inline-block rounded-full bg-clay-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-clay-300">
              Arxeologik kashfiyot
            </span>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              Sug&#39;dning Temir Darvozasi Qo&#39;shrabotda topildi
            </h2>
            <p className="mt-4 text-sand-100/80">
              Tuman hududida Buxoro–Nurota–Jo&#39;sh karvon yo&#39;lini nazorat qilgan ikkita qadimiy
              qal&#39;a — &quot;Temir qapig&#39;&quot; — aniqlangan. Bu yerdan XII–XIII asrlarga oid sopol
              parchalari topilgan, tarixiy manbalarda esa 1582-yilda Abdullaxon qo&#39;shini shu
              yo&#39;ldan o&#39;tgani qayd etiladi.
            </p>
            <Link
              href="/tarix"
              className="mt-6 inline-block rounded-full border border-sand-50/30 px-6 py-3 text-sm font-bold transition hover:bg-sand-50/10"
            >
              To&#39;liq tarixni o&#39;qish →
            </Link>
          </div>
          <div className="flex h-56 items-center justify-center rounded-2xl bg-deep-900/60 text-7xl">
            🏰
          </div>
        </div>
      </section>

      {/* Mashhur kishilar */}
      <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Hamjamiyat"
            title="Taniqli qo'shrabotliklar"
            description="Tumanimizdan yetishib chiqqan olimlar, san'atkorlar, sportchilar va tadbirkorlar — hammasi hamjamiyat a'zolari tomonidan qo'shiladi."
          />
          <Link href="/mashhur-kishilar" className="text-sm font-bold text-clay-600 hover:text-clay-700">
            Barchasini ko&#39;rish →
          </Link>
        </div>

        {people.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {people.slice(0, 3).map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            text="Hozircha tasdiqlangan profillar yo'q — birinchi bo'lib qo'shrabotlik mashhur insonni siz taklif qiling!"
            href="/mashhur-kishilar/taklif"
            cta="Kishi taklif qilish"
          />
        )}
      </section>

      {/* Diqqatga sazovor joylar */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Sayohat"
            title="Diqqatga sazovor joylar"
            description="Tarixiy yodgorliklar, tabiat go'shalari va ziyoratgohlar — Qo'shrabotning ko'rishga arzigulik joylari."
          />
          <Link href="/diqqatga-sazovor-joylar" className="text-sm font-bold text-clay-600 hover:text-clay-700">
            Barchasini ko&#39;rish →
          </Link>
        </div>

        {places.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.slice(0, 3).map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            text="Joylar ro'yxati to'ldirilmoqda. Siz ham o'z mahallangizdagi qadimiy yoki go'zal joyni taklif qiling."
            href="/diqqatga-sazovor-joylar"
            cta="Joylarni ko'rish"
          />
        )}
      </section>

      {/* Yangiliklar */}
      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <SectionHeading eyebrow="Yangiliklar" title="Tumandan so'nggi xabarlar" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <NewsCard key={n.id} post={n} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto my-24 max-w-5xl px-5 sm:px-8">
        <div className="rounded-3xl border border-clay-500/20 bg-clay-500/5 p-10 text-center sm:p-14">
          <h2 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
            Siz ham qo&#39;shrabotliksiz?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-800/70">
            Bu sayt hammamizniki. O&#39;z qishlog&#39;ingiz, oilangizdagi mashhur insonlar yoki
            e&#39;tiborga loyiq joylar haqida ma&#39;lumot qo&#39;shing — biz uni tekshirib, saytga
            joylaymiz.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/mashhur-kishilar/taklif"
              className="rounded-full bg-clay-500 px-7 py-3.5 text-sm font-bold text-sand-50 shadow-soft transition hover:bg-clay-600"
            >
              Ma&#39;lumot qo&#39;shish
            </Link>
            <Link
              href="/aloqa"
              className="rounded-full border border-ink-900/15 px-7 py-3.5 text-sm font-bold text-ink-900 transition hover:bg-sand-100"
            >
              Biz bilan bog&#39;lanish
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-sand-300 bg-sand-100/50 p-10 text-center">
      <p className="mx-auto max-w-md text-sm text-ink-800/70">{text}</p>
      <Link
        href={href}
        className="mt-5 inline-block rounded-full bg-clay-500 px-6 py-2.5 text-sm font-bold text-sand-50 hover:bg-clay-600"
      >
        {cta}
      </Link>
    </div>
  );
}
