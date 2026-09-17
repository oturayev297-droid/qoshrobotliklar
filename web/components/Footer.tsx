import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-sand-200 bg-ink-900 text-sand-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-xl font-extrabold text-sand-50">Qo&#39;shrabotliklar</span>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sand-100/70">
            Samarqand viloyati Qo&#39;shrabot tumani va uning odamlari haqidagi norasmiy, hamjamiyat
            tomonidan to&#39;ldiriladigan portal. Tuman tarixi, taniqli kishilari, joylari va
            yangiliklarini bir joyda jamlaymiz.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-sand-100/50">Bo&#39;limlar</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-clay-400" href="/tarix">Tarix</Link></li>
            <li><Link className="hover:text-clay-400" href="/mashhur-kishilar">Mashhur kishilar</Link></li>
            <li><Link className="hover:text-clay-400" href="/diqqatga-sazovor-joylar">Diqqatga sazovor joylar</Link></li>
            <li><Link className="hover:text-clay-400" href="/yangiliklar">Yangiliklar</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-sand-100/50">Rasmiy aloqa</h3>
          <ul className="space-y-2 text-sm text-sand-100/80">
            <li>Tel: (66) 646-15-18</li>
            <li>Email: info@qoshrabot.uz</li>
            <li>
              <a
                className="hover:text-clay-400"
                href="https://gov.uz/oz/qoshrabot"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hokimlik rasmiy sayti ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand-100/10 px-5 py-5 text-center text-xs text-sand-100/50 sm:px-8">
        © {new Date().getFullYear()} Qo&#39;shrabotliklar.uz — Bu norasmiy hamjamiyat loyihasi bo&#39;lib,
        Qo&#39;shrabot tumani hokimligining rasmiy sayti emas.
      </div>
    </footer>
  );
}
