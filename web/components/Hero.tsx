import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-deep-900">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #FBF7F0 1.5px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-clay-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-deep-500/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <span className="mb-6 inline-block rounded-full border border-sand-50/20 bg-sand-50/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sand-50/90">
          Samarqand viloyati · Qo&#39;shrabot tumani
        </span>
        <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-sand-50 sm:text-5xl md:text-6xl">
          Qo&#39;shrabot — <span className="text-clay-400">tarixi, odamlari</span> va bugungi kuni
          bir joyda
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-100/80">
          Qadimgi karvon yo&#39;llari kesishgan yurtdan chiqqan hamjamiyat uchun ochiq platforma.
          Tuman tarixini, taniqli qo&#39;shrabotliklarni, diqqatga sazovor joylarni birga
          to&#39;ldiramiz va kelajak avlodlarga qoldiramiz.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/tarix"
            className="rounded-full bg-clay-500 px-7 py-3.5 text-sm font-bold text-sand-50 shadow-soft transition hover:bg-clay-600"
          >
            Tumanni tanishtirish →
          </Link>
          <Link
            href="/mashhur-kishilar/taklif"
            className="rounded-full border border-sand-50/30 bg-sand-50/5 px-7 py-3.5 text-sm font-bold text-sand-50 transition hover:bg-sand-50/15"
          >
            Hamjamiyatga qo&#39;shiling
          </Link>
        </div>
      </div>
    </section>
  );
}
