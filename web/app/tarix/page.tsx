import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getDistrict } from "@/lib/api";

export const metadata: Metadata = {
  title: "Tarix",
  description: "Qo'shrabot tumanining kelib chiqishi, tarixi va Sug'd Temir Darvozasi haqida.",
};

const TIMELINE = [
  {
    era: "XII–XIII asrlar",
    title: "Temir Darvoza qal'alari",
    text: "Buxoro–Nurota–Jo'sh karvon yo'lini nazorat qilgan ikki qal'a qurilgan. Pastdagi kattasi 60 xonali bo'lib, 120–130 kishilik garnizonga mo'ljallangan. Bu yerdan topilgan sopol parchalari shu davrga oid.",
  },
  {
    era: "1582-yil",
    title: "Abdullaxon qo'shini",
    text: "Tarixiy manbalarga ko'ra, Buxoro xoni Abdullaxon II qo'shini Temir Darvoza orqali o'tgan. Bu yo'lning strategik ahamiyatini yana bir bor tasdiqlaydi.",
  },
  {
    era: "1978-yil 3-aprel",
    title: "Tuman sifatida tashkil topishi",
    text: "Qo'shrabot tumani mustaqil ma'muriy birlik sifatida rasman tashkil etildi.",
  },
  {
    era: "Bugun",
    title: "141 mingdan ortiq aholi",
    text: "Tuman 2 shaharcha, 45 mahalla fuqarolar yig'ini va 137 qishloqdan iborat, maydoni 2160 km².",
  },
];

export default async function TarixPage() {
  const district = await getDistrict();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <PageHeader title="Qo'shrabot tarixi" description={district.nameOrigin} />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <div className="tile p-6">
          <h2 className="font-display text-base font-bold text-qor-50">Nomi qayerdan kelgan</h2>
          <p className="mt-3 text-sm leading-relaxed text-qor-300">
            &quot;Qo&#39;sh&quot; juft degani, &quot;rabot&quot; esa karvonsaroy. Nom bu yerda yonma-yon
            qurilgan ikki qadimiy karvonsaroydan qolgan.
          </p>
        </div>
        <div className="tile p-6">
          <h2 className="font-display text-base font-bold text-qor-50">Qayerda joylashgan</h2>
          <p className="mt-3 text-sm leading-relaxed text-qor-300">
            {district.region}ning shimolida, Nurota tog&#39;lari etagida. {district.borders.join(", ")} bilan
            chegaradosh. Markazi: {district.center}.
          </p>
        </div>
      </div>

      <div className="panel mt-8 p-8 sm:p-12">
        <h2 className="font-display text-xl font-bold text-qor-50">Voqealar tartibi</h2>
        <ol className="mt-8 space-y-9 border-l border-zar-400/30 pl-8">
          {TIMELINE.map((item) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[2.3rem] top-1.5 h-3 w-3 rotate-45 bg-zar-400" aria-hidden />
              <p className="text-sm text-zar-300">{item.era}</p>
              <h3 className="mt-1 font-display text-base font-bold text-qor-50">{item.title}</h3>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-qor-300">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="tile mt-8 p-8">
        <h2 className="font-display text-base font-bold text-qor-50">Manbalar</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-qor-300">
          <li>Samarqand viloyati hokimligi rasmiy sayti, samarkand.uz</li>
          <li>Qo&#39;shrabot tumani hokimligi, gov.uz/oz/qoshrabot</li>
          <li>Vikipediya: Qo&#39;shrabot tumani va Qo&#39;shrabot maqolalari</li>
          <li>Oyina.uz: Sug&#39;dning shimoliy Temir Darvozasi haqidagi arxeologik maqola</li>
        </ul>
        <p className="mt-4 text-sm text-qor-500">
          Ma&#39;lumotlar ochiq manbalardan olingan. Xato topsangiz, &quot;Aloqa&quot; sahifasi orqali yozing.
        </p>
      </div>
    </div>
  );
}
