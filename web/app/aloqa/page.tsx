import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getDistrict } from "@/lib/api";

export const metadata: Metadata = {
  title: "Aloqa",
  description: "Qo'shrabotliklar sayti bilan bog'lanish va tuman hokimligi rasmiy aloqa ma'lumotlari.",
};

export default async function AloqaPage() {
  const district = await getDistrict();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <PageHeader
        title="Biz bilan bog'laning"
        description="Savol, taklif yoki tuzatish kerak bo'lgan ma'lumot bo'lsa, shu yerdan yozing."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr,1fr]">
        <div className="panel p-6 sm:p-10">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="tile p-6">
            <h2 className="font-display text-base font-bold text-qor-50">Sayt haqida</h2>
            <p className="mt-2 text-sm leading-relaxed text-qor-300">
              Qo&#39;shrabotliklar.uz mustaqil hamjamiyat loyihasi. Hujjatlar va davlat xizmatlari
              bo&#39;yicha tuman hokimligiga murojaat qiling.
            </p>
          </div>

          <div className="tile p-6">
            <h2 className="font-display text-base font-bold text-qor-50">Tuman hokimligi</h2>
            <ul className="mt-3 space-y-2 text-sm text-qor-300">
              <li>
                Telefon: <a href="tel:+998666461518" className="link">{district.contact.phone}</a>
              </li>
              <li>
                Email: <a href={`mailto:${district.contact.email}`} className="link">{district.contact.email}</a>
              </li>
              <li>
                <a href="https://gov.uz/oz/qoshrabot" target="_blank" rel="noopener noreferrer" className="link">
                  gov.uz/oz/qoshrabot
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
