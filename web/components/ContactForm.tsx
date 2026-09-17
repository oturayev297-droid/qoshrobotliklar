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
      setErrorMsg(res.error || "Xabar yuborilmadi. Maydonlarni tekshirib, qayta yuboring.");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-zar-400/30 bg-zar-400/10 p-8 text-center">
        <p className="font-display text-lg font-bold text-qor-50">Xabaringiz yuborildi</p>
        <p className="mt-2 text-sm text-qor-300">Tez orada siz bilan bog&#39;lanamiz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ismingiz" name="name" required placeholder="Ism Familiya" />
        <Field label="Telefon" name="phone" type="tel" placeholder="+998 90 123 45 67" />
      </div>
      <Field label="Email" name="email" type="email" placeholder="email@misol.uz" />
      <div>
        <label htmlFor="message" className="field-label">
          Xabar
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Savol, taklif yoki tuzatish kerak bo'lgan ma'lumot"
          className="field"
        />
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-300">
          {errorMsg}
        </p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-fit">
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
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <input id={name} type={type} name={name} required={required} placeholder={placeholder} className="field" />
    </div>
  );
}
