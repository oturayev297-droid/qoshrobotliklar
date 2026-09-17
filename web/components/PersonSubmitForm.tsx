"use client";

import { FormEvent, useState } from "react";
import { submitPerson } from "@/lib/api";

const CATEGORIES = ["Olim", "San'atkor", "Sportchi", "Tadbirkor", "Davlat arbobi", "Boshqa"];

export default function PersonSubmitForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      fullName: String(form.get("fullName") || ""),
      category: String(form.get("category") || ""),
      village: String(form.get("village") || "") || undefined,
      achievement: String(form.get("achievement") || "") || undefined,
      bio: String(form.get("bio") || ""),
      sourceUrl: String(form.get("sourceUrl") || "") || undefined,
    };
    const res = await submitPerson(payload);
    if (res.ok) {
      setStatus("done");
      formEl.reset();
    } else {
      setStatus("error");
      setErrorMsg(res.error || "Taklif yuborilmadi. Maydonlarni tekshirib, qayta yuboring.");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-zar-400/30 bg-zar-400/10 p-8 text-center">
        <p className="font-display text-lg font-bold text-qor-50">Taklifingiz yuborildi</p>
        <p className="mt-2 text-sm text-qor-300">
          Moderator tekshirgach, u &quot;Mashhur kishilar&quot; sahifasida chiqadi.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="field-label">
            To&#39;liq ism
          </label>
          <input id="fullName" name="fullName" required minLength={3} placeholder="Ism Familiya" className="field" />
        </div>
        <div>
          <label htmlFor="category" className="field-label">
            Sohasi
          </label>
          <select id="category" name="category" required className="field">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="village" className="field-label">
            MFY yoki qishloq
          </label>
          <input id="village" name="village" placeholder="Masalan: Jo'sh MFY" className="field" />
        </div>
        <div>
          <label htmlFor="achievement" className="field-label">
            Asosiy yutug&#39;i
          </label>
          <input id="achievement" name="achievement" placeholder="Nima bilan tanilgan?" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="field-label">
          Qisqacha tarjimai hol
        </label>
        <textarea
          id="bio"
          name="bio"
          required
          minLength={20}
          rows={5}
          placeholder="Kamida 20 belgi"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="sourceUrl" className="field-label">
          Manba havolasi <span className="font-normal text-qor-500">(ixtiyoriy, tekshirish uchun)</span>
        </label>
        <input id="sourceUrl" name="sourceUrl" type="url" placeholder="https://..." className="field" />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-300">
          {errorMsg}
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-fit">
        {status === "loading" ? "Yuborilmoqda..." : "Taklifni yuborish"}
      </button>
    </form>
  );
}
