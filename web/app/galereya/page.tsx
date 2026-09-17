import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { getPlaces } from "@/lib/api";

export const metadata: Metadata = {
  title: "Galereya",
  description: "Qo'shrabot tumanidan suratlar galereyasi.",
};

export default async function GalereyaPage() {
  const places = await getPlaces();
  const withPhotos = places.filter((p) => p.photoUrl);

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Galereya"
        title="Qo'shrabot suratlarda"
        description="Hamjamiyat a'zolari tomonidan yuborilgan suratlar. O'z rasmlaringizni ulashmoqchimisiz? Aloqa sahifasi orqali yuboring."
      />

      {withPhotos.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {withPhotos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={p.photoUrl as string}
              alt={p.title}
              className="aspect-square w-full rounded-2xl object-cover shadow-soft"
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-sand-300 bg-sand-100/50 p-14 text-center">
          <p className="text-3xl">📷</p>
          <p className="mx-auto mt-4 max-w-md text-ink-800/70">
            Galereya hali bo&#39;sh. Qo&#39;shrabotning go&#39;zal manzaralari, mahalliy bayramlar yoki
            tarixiy joylar suratlarini &quot;Aloqa&quot; sahifasi orqali yuboring — birinchilardan bo&#39;lib
            galereyaga qo&#39;shamiz.
          </p>
        </div>
      )}
    </div>
  );
}
