import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PersonSubmitForm from "@/components/PersonSubmitForm";

export const metadata: Metadata = {
  title: "Kishini taklif qilish",
  description: "Qo'shrabotdan yetishib chiqqan taniqli insonni saytga taklif qiling.",
};

export default function TaklifPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <PageHeader
        title="Taniqli qo'shrabotlikni taklif qiling"
        description="Moderator ma'lumotni tekshirgach, u Mashhur kishilar sahifasida chiqadi."
      />
      <div className="panel mt-10 p-6 sm:p-10">
        <PersonSubmitForm />
      </div>
    </div>
  );
}
