import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  admin?: { id: string; role: string; email: string };
}

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  // Ishlab chiqarishda maxfiy kalitsiz ishga tushish xavfli — darhol to'xtaymiz
  throw new Error("JWT_SECRET muhit o'zgaruvchisi o'rnatilmagan");
}

if (!JWT_SECRET) {
  // Ishga tushishda darhol bildirish — ishlab chiqarishda sukut saqlagan holda
  // zaif kalit bilan davom etmasligi uchun
  // eslint-disable-next-line no-console
  console.warn("[OGOHLANTIRISH] JWT_SECRET .env faylida topilmadi. .env.example ga qarang.");
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Avtorizatsiya talab qilinadi" });
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      role: string;
      email: string;
    };
    req.admin = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Token yaroqsiz yoki muddati o'tgan" });
  }
}
