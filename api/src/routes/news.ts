import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const newsSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug faqat lotin harflar, raqam va - dan iborat bo'lishi kerak"),
  excerpt: z.string().min(10).max(400),
  content: z.string().min(20),
  coverUrl: z.string().url().optional(),
  published: z.boolean().optional(),
});

// GET /api/news — chop etilgan yangiliklar ro'yxati
router.get("/", async (_req, res) => {
  const news = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, excerpt: true, coverUrl: true, createdAt: true },
  });
  res.json(news);
});

// GET /api/news/:slug — bitta yangilik
router.get("/:slug", async (req, res) => {
  const post = await prisma.newsPost.findFirst({
    where: { slug: req.params.slug, published: true },
  });
  if (!post) return res.status(404).json({ error: "Topilmadi" });
  res.json(post);
});

// --- Admin ---
router.get("/admin/all", requireAdmin, async (_req, res) => {
  const news = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });
  res.json(news);
});

router.post("/", requireAdmin, async (req, res) => {
  const parsed = newsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() });
  const post = await prisma.newsPost.create({ data: parsed.data });
  res.status(201).json(post);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = newsSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Ma'lumotlar noto'g'ri" });
  const post = await prisma.newsPost.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(post);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.newsPost.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
