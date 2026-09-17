import Link from "next/link";
import ArchMark from "@/components/ArchMark";

// Footer tepasidagi bo'sh joy ataylab qoldirilgan: sahifa oxirida 3D kamera yo'lga tushadi
// va shu "oyna" orqali yo'ldagi mashinalar ko'rinadi.
export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="h-[62vh] min-h-[360px]">
        <div className="mx-auto w-full max-w-7xl px-5 pt-[20vh] sm:px-8">
          <p className="scrim max-w-xl font-display text-xl font-bold leading-snug text-qor-50 sm:text-3xl">
            Karvonlar yurgan yo&#39;l bugun ham shu vodiydan o&#39;tadi.
          </p>
        </div>
      </div>

      <div className="border-t border-qor-50/10 bg-tun-950/[0.9]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[2fr,1fr,1fr]">
          <div>
            <div className="flex items-center gap-3">
              <ArchMark className="h-8 w-8 text-zar-400" />
              <span className="font-display text-lg font-bold text-qor-50">Qo&#39;shrabotliklar</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-qor-300">
              Qo&#39;shrabot tumani va uning odamlari haqidagi norasmiy sayt. Ma&#39;lumotlarni
              hamjamiyat yuboradi, moderator tekshiradi.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-qor-50">Bo&#39;limlar</h2>
            <ul className="space-y-2.5 text-sm text-qor-300">
              <li><Link className="hover:text-zar-300" href="/tarix">Tarix</Link></li>
              <li><Link className="hover:text-zar-300" href="/mashhur-kishilar">Mashhur kishilar</Link></li>
              <li><Link className="hover:text-zar-300" href="/diqqatga-sazovor-joylar">Diqqatga sazovor joylar</Link></li>
              <li><Link className="hover:text-zar-300" href="/yangiliklar">Yangiliklar</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-qor-50">Tuman hokimligi</h2>
            <ul className="space-y-2.5 text-sm text-qor-300">
              <li>
                <a className="hover:text-zar-300" href="tel:+998666461518">(66) 646-15-18</a>
              </li>
              <li>
                <a className="hover:text-zar-300" href="mailto:info@qoshrabot.uz">info@qoshrabot.uz</a>
              </li>
              <li>
                <a className="hover:text-zar-300" href="https://gov.uz/oz/qoshrabot" target="_blank" rel="noopener noreferrer">
                  Rasmiy sayt (gov.uz)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-t border-qor-50/10 px-5 py-5 text-center text-xs text-qor-500 sm:px-8">
          © {new Date().getFullYear()} Qo&#39;shrabotliklar.uz. Norasmiy hamjamiyat loyihasi, tuman
          hokimligining rasmiy sayti emas.
        </p>
      </div>
    </footer>
  );
}
