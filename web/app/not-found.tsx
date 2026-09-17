import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center sm:px-8">
      <p className="scrim font-display text-7xl font-bold text-zar-400">404</p>
      <h1 className="scrim mt-6 font-display text-2xl font-bold text-qor-50 sm:text-3xl">Bu yo&#39;l hech qayerga olib bormaydi</h1>
      <p className="scrim mt-3 text-qor-100/85">Sahifa o&#39;chirilgan yoki manzil noto&#39;g&#39;ri yozilgan.</p>
      <Link href="/" className="btn-primary mt-8">
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
