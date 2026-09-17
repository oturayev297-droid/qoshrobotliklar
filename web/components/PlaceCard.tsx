import ArchMark from "@/components/ArchMark";
import { Place } from "@/lib/types";

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="tile flex flex-col overflow-hidden hover:border-zar-400/40">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-b from-lojuvard-500/35 to-tun-900/80">
        {place.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.photoUrl} alt={place.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ArchMark className="h-16 w-16 text-zar-400/40" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-tun-950/80 px-3 py-1 text-xs font-medium text-zar-300">
          {place.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-base font-bold text-qor-50">{place.title}</h3>
        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-qor-300">{place.description}</p>
        {(place.village || place.mapUrl) && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            {place.village && <span className="text-qor-500">{place.village}</span>}
            {place.mapUrl && (
              <a href={place.mapUrl} target="_blank" rel="noopener noreferrer" className="link">
                Xaritada ochish
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
