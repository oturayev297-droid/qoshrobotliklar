"use client";

import { FormEvent, useState } from "react";
import { submitContact } from "@/lib/api";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || "") || undefined,
      email: String(form.get("email") || "") || undefined,
      message: String(form.get("message") || ""),
    };
    const res = await submitContact(payload);
    if (res.ok) {
      setStatus("done");
      formEl.reset();
    } else {
      setStatus("error");
      setErrorMsg(res.error || "Xatolik yuz berdi");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-deep-600/30 bg-deep-700/5 p-8 text-center">
        <p className="text-lg font-bold text-deep-700">Rahmat! Xabaringiz qabul qilindi.</p>
        <p className="mt-2 text-sm text-ink-800/70">Tez orada siz bilan bog&#39;lanamiz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ismingiz" name="name" required placeholder="Ismingizni kiriting" />
        <Field label="Telefon" name="phone" placeholder="+998 90 123 45 67" />
      </div>
      <Field label="Email" name="email" type="email" placeholder="email@misol.uz" />
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-900">Xabar</label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Fikringiz, taklifingiz yoki savolingizni yozing..."
          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
        />
      </div>
      {status === "error" && <p className="text-sm font-semibold text-red-600">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-fit rounded-full bg-clay-500 px-7 py-3 text-sm font-bold text-sand-50 shadow-soft transition hover:bg-clay-600 disabled:opacity-60"
      >
        {status === "loading" ? "Yuborilmoqda..." : "Xabarni yuborish"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink-900">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
      />
    </div>
  );
}
