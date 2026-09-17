import { Person } from "@/lib/types";

export default function PersonCard({ person }: { person: Person }) {
  const initials = person.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="group flex flex-col rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        {person.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.photoUrl}
            alt={person.fullName}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-deep-700 font-display text-lg font-bold text-sand-50">
            {initials}
          </div>
        )}
        <div>
          <h3 className="font-display text-lg font-bold text-ink-900">{person.fullName}</h3>
          <span className="text-xs font-bold uppercase tracking-wide text-clay-600">{person.category}</span>
        </div>
      </div>
      {person.achievement && (
        <p className="mb-2 text-sm font-semibold text-deep-700">{person.achievement}</p>
      )}
      <p className="line-clamp-4 text-sm leading-relaxed text-ink-800/70">{person.bio}</p>
      {person.village && (
        <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-800/60">
          📍 {person.village}
        </span>
      )}
    </article>
  );
}
