import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { getDistrict } from "@/lib/api";

export const metadata: Metadata = {
  title: "Aloqa",
  description: "Qo'shrabotliklar sayti bilan bog'lanish va tuman hokimligi rasmiy aloqa ma'lumotlari.",
};

export default async function AloqaPage() {
  const district = await getDistrict();

  return (
    <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Aloqa"
        title="Biz bilan bog'laning"
        description="Savol, taklif yoki tuzatish kerak bo'lgan ma'lumot bormi? Quyidagi forma orqali yozing."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr,1fr]">
        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-soft sm:p-8">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold text-ink-900">Sayt jamoasi</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-800/70">
              Qo&#39;shrabotliklar.uz — mustaqil, hamjamiyat asosidagi loyiha. Rasmiy hujjatlar yoki
              davlat xizmatlari bo&#39;yicha hokimlikning rasmiy saytiga murojaat qiling.
            </p>
          </div>

          <div className="rounded-2xl bg-deep-800 p-6 text-sand-50">
            <h3 className="font-display text-lg font-bold">Tuman hokimligi (rasmiy)</h3>
            <ul className="mt-3 space-y-2 text-sm text-sand-100/85">
              <li>📞 {district.contact.phone}</li>
              <li>✉️ {district.contact.email}</li>
              <li>
                <a
                  href="https://gov.uz/oz/qoshrabot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-clay-400 underline-offset-4 hover:text-clay-300"
                >
                  gov.uz/oz/qoshrabot ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
