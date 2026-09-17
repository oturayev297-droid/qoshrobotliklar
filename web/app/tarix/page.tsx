import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { getDistrict } from "@/lib/api";

export const metadata: Metadata = {
  title: "Tarix",
  description: "Qo'shrabot tumanining kelib chiqishi, tarixi va Sug'd Temir Darvozasi haqida.",
};

const TIMELINE = [
  {
    era: "XII–XIII asrlar",
    title: "Temir Darvoza qal'alari",
    text: "Buxoro–Nurota–Jo'sh karvon yo'lini nazorat qilgan ikkita qal'a — pastdagi kattasi 60 xonali, taxminan 120–130 kishilik garnizon bilan — qurilgan. Bu yerda topilgan sopol parchalari shu davrga oid.",
  },
  {
    era: "1582-yil",
    title: "Abdullaxon qo'shini",
    text: "Tarixiy manbalarga ko'ra, Buxoro xoni Abdullaxon II qo'shini Temir Darvoza orqali o'tgan — bu yo'lning strategik ahamiyatini yana bir bor tasdiqlaydi.",
  },
  {
    era: "1978-yil 3-aprel",
    title: "Tuman sifatida tashkil topishi",
    text: "Qo'shrabot tumani mustaqil ma'muriy birlik sifatida rasman tashkil etildi.",
  },
  {
    era: "Bugungi kun",
    title: "141 000+ aholi",
    text: "Tuman 2 ta shaharcha, 45 mahalla fuqarolar yig'ini va 137 qishloqdan iborat, 2160 km² maydonni egallaydi.",
  },
];

export default async function TarixPage() {
  const district = await getDistrict();

  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <SectionHeading eyebrow="Tarix" title="Qo'shrabot nomining kelib chiqishi" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold text-ink-900">Nom etimologiyasi</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-800/75">{district.nameOrigin}</p>
        </div>
        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold text-ink-900">Geografik joylashuvi</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-800/75">
            {district.region}da joylashgan Qo&#39;shrabot tumani {district.borders.join(", ")} bilan
            chegaradosh. Markazi — {district.center}.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="font-display text-xl font-bold text-ink-900">Voqealar tarixi</h3>
        <div className="mt-8 space-y-8 border-l-2 border-sand-200 pl-8">
          {TIMELINE.map((item) => (
            <div key={item.title} className="relative">
              <span className="absolute -left-[2.35rem] top-1 h-4 w-4 rounded-full border-4 border-sand-50 bg-clay-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-clay-600">{item.era}</span>
              <h4 className="mt-1 font-display text-lg font-bold text-ink-900">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-800/75">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-deep-800 p-8 text-sand-50">
        <h3 className="font-display text-lg font-bold">Manbalar</h3>
        <ul className="mt-3 space-y-1 text-sm text-sand-100/80">
          <li>Samarqand viloyati hokimligi rasmiy sayti — samarkand.uz</li>
          <li>Qo&#39;shrabot tumani hokimligi — gov.uz/oz/qoshrabot</li>
          <li>Vikipediya — Qo&#39;shrabot tumani va Qo&#39;shrabot maqolalari</li>
          <li>Oyina.uz — Sug&#39;dning shimoliy Temir Darvozasi haqidagi arxeologik maqola</li>
        </ul>
        <p className="mt-4 text-xs text-sand-100/50">
          Eslatma: bu sahifadagi ma&#39;lumotlar ochiq manbalar asosida tuzilgan. Xato yoki
          to&#39;ldirish kerak bo&#39;lgan joyni topsangiz, &quot;Aloqa&quot; sahifasi orqali xabar bering.
        </p>
      </div>
    </div>
  );
}
