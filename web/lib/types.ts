export interface Person {
  id: string;
  fullName: string;
  category: string;
  village?: string | null;
  bio: string;
  achievement?: string | null;
  photoUrl?: string | null;
  sourceUrl?: string | null;
  featured: boolean;
  createdAt: string;
}

export interface Place {
  id: string;
  title: string;
  type: string;
  description: string;
  village?: string | null;
  mapUrl?: string | null;
  photoUrl?: string | null;
  featured: boolean;
  createdAt: string;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  coverUrl?: string | null;
  createdAt: string;
}

export interface District {
  name: string;
  region: string;
  founded: string;
  center: string;
  areaKm2: number;
  population: { total: number; male: number; female: number; asOf: string };
  administrative: { urbanSettlements: number; neighborhoods: number; villages: number };
  borders: string[];
  nameOrigin: string;
  contact: { phone: string; email: string };
}
