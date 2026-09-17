import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PlaceCard from "@/components/PlaceCard";
import EmptyState from "@/components/EmptyState";
import { getPlaces } from "@/lib/api";

export const metadata: Metadata = {
  title: "Diqqatga sazovor joylar",
  description: "Qo'shrabot tumanidagi tarixiy yodgorliklar, tabiat go'shalari va ziyoratgohlar.",
};

export default async function JoylarPage() {
  const places = await getPlaces();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <PageHeader
        title="Diqqatga sazovor joylar"
        description="Sug'd Temir Darvozasidan mahalliy ziyoratgoh va tabiat go'shalarigacha. Ro'yxatni hamjamiyat to'ldiradi."
      />

      {places.length > 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          text="Ro'yxat hali to'ldirilmoqda. Mahallangizdagi joy haqida yozing, uni ro'yxatga qo'shamiz."
          href="/aloqa"
          cta="Joy haqida yozish"
        />
      )}
    </div>
  );
}
