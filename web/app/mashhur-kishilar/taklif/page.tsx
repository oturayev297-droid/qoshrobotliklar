import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PersonSubmitForm from "@/components/PersonSubmitForm";

export const metadata: Metadata = {
  title: "Kishi taklif qilish",
  description: "Qo'shrabotdan yetishib chiqqan taniqli insonni saytga taklif qiling.",
};

export default function TaklifPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Hissa qo'shing"
        title="Taniqli qo'shrabotlikni taklif qiling"
        description="Formani to'ldiring — ma'lumot moderator tomonidan tekshirilgach, 'Mashhur kishilar' sahifasida e'lon qilinadi."
      />
      <div className="mt-10 rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-soft sm:p-8">
        <PersonSubmitForm />
      </div>
    </div>
  );
}
