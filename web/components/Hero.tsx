import Link from "next/link";
import { District } from "@/lib/types";

// Bosh sahifa ochilishi: 3D vodiy ustida tuman nomi va asosiy raqamlar
export default function Hero({ district }: { district: District }) {
  const stats = [
    { value: district.population.total.toLocaleString("uz-UZ"), label: "aholi" },
    { value: `${district.areaKm2.toLocaleString("uz-UZ")} km²`, label: "maydon" },
    { value: String(district.administrative.villages), label: "qishloq" },
    { value: district.founded.split("-")[0], label: "tuman bo'lgan yil" },
  ];

  return (
    <section className="relative isolate flex min-h-[calc(100svh-68px)] items-end">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-tun-950/80 via-tun-950/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-tun-950/70 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pb-14">
        <p className="scrim text-base text-zar-300">Samarqand viloyati, Nurota tog&#39;lari etagi</p>
        <h1 className="scrim mt-3 font-display text-[clamp(3rem,12vw,9.5rem)] font-bold leading-[0.92] tracking-tight text-qor-50">
          Qo&#39;shrabot
        </h1>
        <p className="scrim mt-6 max-w-xl text-lg leading-relaxed text-qor-100/90">
          Ikki karvonsaroy yonida o&#39;sgan tuman. Uning tarixini, odamlarini va bugungi kunini shu
          yerda birga yozamiz.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tarix" className="btn-primary">
            Tarixni o&#39;qish
          </Link>
          <Link href="/mashhur-kishilar/taklif" className="btn-ghost">
            Ma&#39;lumot qo&#39;shish
          </Link>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-y-6 border-t border-qor-50/15 pt-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse sm:border-l sm:border-qor-50/15 sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
              <dt className="mt-1 text-sm text-qor-300">{s.label}</dt>
              <dd className="scrim font-display text-2xl font-bold text-qor-50 sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 hidden text-sm text-qor-300 sm:block">
          Pastga suring: tog&#39;lar orasidan yo&#39;lga tushamiz
        </p>
      </div>
    </section>
  );
}
