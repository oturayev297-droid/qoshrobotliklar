import { Person } from "@/lib/types";

export default function PersonCard({ person }: { person: Person }) {
  const initials = person.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="tile flex flex-col p-6 hover:border-zar-400/40">
      <div className="mb-4 flex items-center gap-4">
        {person.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.photoUrl} alt={person.fullName} className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lojuvard-500/25 font-display text-base font-bold text-lojuvard-300">
            {initials}
          </div>
        )}
        <div>
          <h3 className="font-display text-base font-bold text-qor-50">{person.fullName}</h3>
          <span className="text-sm text-zar-300">{person.category}</span>
        </div>
      </div>
      {person.achievement && <p className="mb-2 text-sm font-semibold text-qor-50">{person.achievement}</p>}
      <p className="line-clamp-4 text-sm leading-relaxed text-qor-300">{person.bio}</p>
      {person.village && <span className="mt-4 text-sm text-qor-500">{person.village}</span>}
    </article>
  );
}
