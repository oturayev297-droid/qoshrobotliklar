import { Place } from "@/lib/types";

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-sand-50 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-deep-700 to-deep-900 text-sand-50">
        <span className="font-display text-4xl opacity-30">🏺</span>
        <span className="absolute left-3 top-3 rounded-full bg-sand-50/90 px-3 py-1 text-xs font-bold text-deep-800">
          {place.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold text-ink-900">{place.title}</h3>
        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-ink-800/70">
          {place.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          {place.village && (
            <span className="text-xs font-semibold text-ink-800/60">📍 {place.village}</span>
          )}
          {place.mapUrl && (
            <a
              href={place.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-clay-600 hover:text-clay-700"
            >
              Xaritada ko&#39;rish ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
