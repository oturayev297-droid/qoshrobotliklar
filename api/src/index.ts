import "dotenv/config";
import express from "express";
// async route handlerlardagi xatolarni error middleware'ga uzatadi (aks holda jarayon qulaydi)
import "express-async-errors";
import { Prisma } from "@prisma/client";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import peopleRoutes from "./routes/people";
import placesRoutes from "./routes/places";
import newsRoutes from "./routes/news";
import contactRoutes from "./routes/contact";
import districtRoutes from "./routes/district";

const app = express();

// Railway load balancer/proxy ortida to'g'ri IP aniqlash uchun
app.set("trust proxy", 1);

app.use(helmet());
// CORS_ORIGIN berilmagan bo'lsa hamma domenga ruxsat; aks holda vergul bilan ajratilgan ro'yxat.
// Oxiridagi "/" olib tashlanadi — brauzer Origin sarlavhasini doim "/"siz yuboradi.
const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length === 0 || corsOrigins.includes("*") ? "*" : corsOrigins,
  }),
);
app.use(express.json({ limit: "1mb" }));

// Umumiy so'rovlar uchun cheklov (DDoS/spam'dan asosiy himoya)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "qoshrabotliklar-api" });
});

app.get("/health", (_req, res) => res.json({ status: "healthy" }));

app.use("/api/auth", authRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/district", districtRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint topilmadi" });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Prisma: yozuv topilmadi (masalan, mavjud bo'lmagan id bilan PATCH/DELETE)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({ error: "Topilmadi" });
  }
  // Prisma: unique maydon takrorlandi (masalan, yangilik slug'i)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({ error: "Bunday yozuv allaqachon mavjud" });
  }
  // Noto'g'ri JSON body
  if ((err as { type?: string }).type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON noto'g'ri formatda" });
  }
  console.error(err);
  res.status(500).json({ error: "Server xatosi yuz berdi" });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Qo'shrabotliklar API ${PORT}-portda ishga tushdi`);
});
