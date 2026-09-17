import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PlaceCard from "@/components/PlaceCard";
import { getPlaces } from "@/lib/api";

export const metadata: Metadata = {
  title: "Diqqatga sazovor joylar",
  description: "Qo'shrabot tumanidagi tarixiy yodgorliklar, tabiat go'shalari va ziyoratgohlar.",
};

export default async function JoylarPage() {
  const places = await getPlaces();

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Sayohat"
        title="Diqqatga sazovor joylar"
        description="Sug'd Temir Darvozasidan tortib, mahalliy ziyoratgohlar va tabiat go'shalarigacha — hamjamiyat tomonidan to'ldiriladigan xarita."
      />

      {places.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-sand-300 bg-sand-100/50 p-14 text-center">
          <p className="text-3xl">🗺️</p>
          <p className="mx-auto mt-4 max-w-md text-ink-800/70">
            Joylar ro&#39;yxati hali to&#39;ldirilmoqda. &quot;Aloqa&quot; sahifasi orqali o&#39;z
            mahallangizdagi joy haqida yozib yuboring — uni ro&#39;yxatga qo&#39;shamiz.
          </p>
        </div>
      )}
    </div>
  );
}
