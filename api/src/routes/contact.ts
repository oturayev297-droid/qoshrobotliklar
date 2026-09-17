import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  message: z.string().min(10).max(3000),
});

router.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() });
  }
  const msg = await prisma.contactMessage.create({ data: parsed.data });
  res.status(201).json({ message: "Xabaringiz qabul qilindi. Tez orada bog'lanamiz!", id: msg.id });
});

router.get("/admin/all", requireAdmin, async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  res.json(messages);
});

router.patch("/:id/handled", requireAdmin, async (req, res) => {
  const msg = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { handled: true },
  });
  res.json(msg);
});

export default router;
