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
      setErrorMsg(res.error || "Xatolik yuz berdi");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-deep-600/30 bg-deep-700/5 p-8 text-center">
        <p className="text-lg font-bold text-deep-700">Taklifingiz uchun rahmat!</p>
        <p className="mt-2 text-sm text-ink-800/70">
          Moderator tomonidan ko&#39;rib chiqilgach, &quot;Mashhur kishilar&quot; sahifasida chop etiladi.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-900">To&#39;liq ism</label>
          <input
            name="fullName"
            required
            minLength={3}
            placeholder="Ism Familiya"
            className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-900">Sohasi</label>
          <select
            name="category"
            required
            className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
          >
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
          <label className="mb-1.5 block text-sm font-semibold text-ink-900">MFY / Qishloq</label>
          <input
            name="village"
            placeholder="Masalan: Jo'sh MFY"
            className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-900">Asosiy yutuq</label>
          <input
            name="achievement"
            placeholder="Nima bilan mashhur?"
            className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-900">Qisqacha tarjimai hol</label>
        <textarea
          name="bio"
          required
          minLength={20}
          rows={5}
          placeholder="Bu inson haqida qisqacha ma'lumot yozing (kamida 20 belgi)..."
          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-900">
          Manba havolasi <span className="font-normal text-ink-800/50">(ixtiyoriy, tasdiqlash uchun)</span>
        </label>
        <input
          name="sourceUrl"
          type="url"
          placeholder="https://..."
          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none ring-clay-500/30 transition focus:ring-4"
        />
      </div>

      {status === "error" && <p className="text-sm font-semibold text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-fit rounded-full bg-clay-500 px-7 py-3 text-sm font-bold text-sand-50 shadow-soft transition hover:bg-clay-600 disabled:opacity-60"
      >
        {status === "loading" ? "Yuborilmoqda..." : "Taklifni yuborish"}
      </button>
    </form>
  );
}
