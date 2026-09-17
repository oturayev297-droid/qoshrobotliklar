import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import PersonCard from "@/components/PersonCard";
import PlaceCard from "@/components/PlaceCard";
import NewsCard from "@/components/NewsCard";
import EmptyState from "@/components/EmptyState";
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
      <Hero district={district} />

      {/* Temir Darvoza */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="panel grid items-center gap-10 p-8 md:grid-cols-[1.15fr,1fr] md:p-12">
          <div>
            <p className="text-sm text-zar-300">Arxeologik topilma</p>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-qor-50 sm:text-3xl">
              Sug&#39;dning Temir Darvozasi shu yerda topildi
            </h2>
            <p className="mt-5 max-w-prose leading-relaxed text-qor-300">
              Tuman hududida Buxoro, Nurota va Jo&#39;sh orasidagi karvon yo&#39;lini nazorat qilgan ikki
              qadimiy qal&#39;a aniqlangan. Ulardan XII–XIII asrlarga oid sopol parchalari chiqqan.
              Manbalarga ko&#39;ra, 1582-yilda Abdullaxon qo&#39;shini ham shu yo&#39;ldan o&#39;tgan.
            </p>
            <Link href="/tarix" className="btn-ghost mt-7">
              To&#39;liq tarixni o&#39;qish
            </Link>
          </div>
          <GateIllustration />
        </div>
      </section>

      {/* Mashhur kishilar */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Taniqli qo'shrabotliklar"
            description="Tumandan chiqqan olimlar, san'atkorlar, sportchilar va tadbirkorlar. Ro'yxatni hamjamiyat to'ldiradi."
          />
          <Link href="/mashhur-kishilar" className="link scrim text-sm">
            Hammasini ko&#39;rish
          </Link>
        </div>
        {people.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {people.slice(0, 3).map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            text="Hali tasdiqlangan profil yo'q. Qo'shrabotdan chiqqan taniqli insonni birinchi bo'lib siz taklif qiling."
            href="/mashhur-kishilar/taklif"
            cta="Kishini taklif qilish"
          />
        )}
      </section>

      {/* Diqqatga sazovor joylar */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Diqqatga sazovor joylar"
            description="Tarixiy yodgorliklar, tabiat go'shalari va ziyoratgohlar."
          />
          <Link href="/diqqatga-sazovor-joylar" className="link scrim text-sm">
            Hammasini ko&#39;rish
          </Link>
        </div>
        {places.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {places.slice(0, 3).map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            text="Joylar ro'yxati to'ldirilmoqda. Mahallangizdagi qadimiy yoki go'zal joy haqida bizga yozing."
            href="/aloqa"
            cta="Joy haqida yozish"
          />
        )}
      </section>

      {/* Yangiliklar */}
      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading title="Tumandan so'nggi xabarlar" />
            <Link href="/yangiliklar" className="link scrim text-sm">
              Barcha yangiliklar
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <NewsCard key={n.id} post={n} />
            ))}
          </div>
        </section>
      )}

      {/* Hamjamiyatga taklif */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="panel flex flex-col gap-8 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold text-qor-50 sm:text-3xl">Siz ham qo&#39;shrabotliksizmi?</h2>
            <p className="mt-3 leading-relaxed text-qor-300">
              Qishlog&#39;ingiz, oilangizdagi taniqli insonlar yoki e&#39;tiborga loyiq joylar haqida
              yozing. Tekshirganimizdan so&#39;ng saytga joylaymiz.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/mashhur-kishilar/taklif" className="btn-primary">
              Ma&#39;lumot qo&#39;shish
            </Link>
            <Link href="/aloqa" className="btn-ghost">
              Bizga yozish
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Ikki qal'a va ular orasidan o'tgan karvon yo'li
function GateIllustration() {
  return (
    <svg viewBox="0 0 320 210" fill="none" aria-hidden className="w-full text-zar-400">
      <path d="M0 176c58-18 96-44 150-40s104 34 170 16" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
      <path
        d="M36 158v-48h12v-12h12v12h14v-12h12v12h14v-12h12v12h12v48"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M82 158v-24a11 11 0 0 1 22 0v24" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M206 124v-34h10v-9h10v9h12v-9h10v9h10v34"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M226 124v-15a7 7 0 0 1 14 0v15" stroke="currentColor" strokeWidth="2.2" />
      <path d="M0 200c90-8 160-30 320-18" stroke="currentColor" strokeOpacity=".6" strokeWidth="1.5" strokeDasharray="6 9" />
      <circle cx="270" cy="38" r="14" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.5" />
    </svg>
  );
}
