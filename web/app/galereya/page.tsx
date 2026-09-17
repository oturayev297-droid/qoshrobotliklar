import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { getPlaces } from "@/lib/api";

export const metadata: Metadata = {
  title: "Galereya",
  description: "Qo'shrabot tumanidan suratlar galereyasi.",
};

export default async function GalereyaPage() {
  const places = await getPlaces();
  const withPhotos = places.filter((p) => p.photoUrl);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <PageHeader
        title="Qo'shrabot suratlarda"
        description="Hamjamiyat yuborgan suratlar. O'z suratingizni ulashish uchun Aloqa sahifasidan yozing."
      />

      {withPhotos.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {withPhotos.map((p) => (
            <figure key={p.id} className="tile overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photoUrl as string} alt={p.title} className="aspect-square w-full object-cover" />
              <figcaption className="px-3 py-2 text-sm text-qor-300">{p.title}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <EmptyState
          text="Galereya hali bo'sh. Manzara, bayram yoki tarixiy joy suratlarini yuboring, birinchilardan bo'lib joylaymiz."
          href="/aloqa"
          cta="Surat yuborish"
        />
      )}
    </div>
  );
}
