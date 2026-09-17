import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center sm:px-8">
      <span className="text-5xl">🧭</span>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-ink-900">Sahifa topilmadi</h1>
      <p className="mt-3 text-ink-800/70">
        Siz qidirgan sahifa mavjud emas yoki ko&#39;chirilgan bo&#39;lishi mumkin.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-clay-500 px-7 py-3 text-sm font-bold text-sand-50 hover:bg-clay-600"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
