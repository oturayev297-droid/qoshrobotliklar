import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const personSchema = z.object({
  fullName: z.string().min(3).max(120),
  category: z.string().min(2).max(60),
  village: z.string().max(120).optional(),
  bio: z.string().min(20).max(4000),
  achievement: z.string().max(300).optional(),
  photoUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
});

// GET /api/people — ommaga ochiq, faqat tasdiqlanganlar
router.get("/", async (req, res) => {
  const { category, featured } = req.query;
  const people = await prisma.person.findMany({
    where: {
      status: "APPROVED",
      ...(category ? { category: String(category) } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  res.json(people);
});

// POST /api/people — jamoat a'zosi "Taklif qilish" formasi orqali yuboradi (moderatsiyaga tushadi)
router.post("/", async (req, res) => {
  const parsed = personSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() });
  }
  const person = await prisma.person.create({
    data: { ...parsed.data, status: "PENDING" },
  });
  res.status(201).json({ message: "Taklifingiz uchun rahmat! Moderatordan tasdiqlangach saytda chop etiladi.", id: person.id });
});

// --- Admin panel uchun ---

// GET /api/people/admin/all — barcha statuslar (PENDING/APPROVED/REJECTED)
router.get("/admin/all", requireAdmin, async (_req, res) => {
  const people = await prisma.person.findMany({ orderBy: { createdAt: "desc" } });
  res.json(people);
});

// PATCH /api/people/:id/status — moderatsiya: tasdiqlash/rad etish
router.patch("/:id/status", requireAdmin, async (req, res) => {
  const statusSchema = z.object({ status: z.enum(["APPROVED", "REJECTED", "PENDING"]), featured: z.boolean().optional() });
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "status noto'g'ri" });

  const person = await prisma.person.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(person);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.person.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
