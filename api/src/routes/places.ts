import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const placeSchema = z.object({
  title: z.string().min(3).max(150),
  type: z.string().min(2).max(60),
  description: z.string().min(20).max(4000),
  village: z.string().max(120).optional(),
  mapUrl: z.string().url().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  photoUrl: z.string().url().optional(),
});

router.get("/", async (req, res) => {
  const { type, featured } = req.query;
  const places = await prisma.place.findMany({
    where: {
      status: "APPROVED",
      ...(type ? { type: String(type) } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  res.json(places);
});

router.post("/", async (req, res) => {
  const parsed = placeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() });
  }
  const place = await prisma.place.create({ data: { ...parsed.data, status: "PENDING" } });
  res.status(201).json({ message: "Taklifingiz uchun rahmat! Moderatsiyadan so'ng chop etiladi.", id: place.id });
});

router.get("/admin/all", requireAdmin, async (_req, res) => {
  const places = await prisma.place.findMany({ orderBy: { createdAt: "desc" } });
  res.json(places);
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  const statusSchema = z.object({ status: z.enum(["APPROVED", "REJECTED", "PENDING"]), featured: z.boolean().optional() });
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "status noto'g'ri" });

  const place = await prisma.place.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(place);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.place.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
