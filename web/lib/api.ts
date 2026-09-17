import { District, NewsPost, Person, Place } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Backend hali deploy qilinmagan yoki javob bermayotgan bo'lsa ham sayt qulamasligi uchun
// har bir so'rov xavfsiz tarzda bo'sh natija (yoki fallback) bilan qaytadi.
async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
      // Backend sekin yoki "uxlab" qolgan bo'lsa sahifa kutib qolmasin — fallback bilan davom etamiz
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const FALLBACK_DISTRICT: District = {
  name: "Qo'shrabot tumani",
  region: "Samarqand viloyati",
  founded: "1978-yil 3-aprel",
  center: "Qo'shrabot shaharchasi",
  areaKm2: 2160,
  population: { total: 141851, male: 72397, female: 69454, asOf: "2024-01-01" },
  administrative: { urbanSettlements: 2, neighborhoods: 45, villages: 137 },
  borders: ["Navoiy viloyati", "Jizzax viloyati", "Kattaqo'rg'on tumani", "Ishtixon tumani", "Payariq tumani"],
  nameOrigin:
    "\"Qo'sh\" (juft) va \"Rabot\" (karvonsaroy) so'zlaridan — yonma-yon qurilgan ikkita qadimiy karvonsaroy joylashgan hudud.",
  contact: { phone: "(66) 646-15-18", email: "info@qoshrabot.uz" },
};

export function getDistrict() {
  return safeGet<District>("/api/district", FALLBACK_DISTRICT);
}

export function getPeople(params?: { featured?: boolean }) {
  const qs = params?.featured ? "?featured=true" : "";
  return safeGet<Person[]>(`/api/people${qs}`, []);
}

export function getPlaces(params?: { featured?: boolean }) {
  const qs = params?.featured ? "?featured=true" : "";
  return safeGet<Place[]>(`/api/places${qs}`, []);
}

export function getNews() {
  return safeGet<NewsPost[]>("/api/news", []);
}

export function getNewsBySlug(slug: string) {
  return safeGet<NewsPost | null>(`/api/news/${encodeURIComponent(slug)}`, null);
}

async function safePost<T>(path: string, body: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data?.error || "Xatolik yuz berdi" };
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Serverga ulanib bo'lmadi. Birozdan so'ng qayta urinib ko'ring." };
  }
}

export function submitPerson(payload: Record<string, unknown>) {
  return safePost("/api/people", payload);
}

export function submitPlace(payload: Record<string, unknown>) {
  return safePost("/api/places", payload);
}

export function submitContact(payload: Record<string, unknown>) {
  return safePost("/api/contact", payload);
}
