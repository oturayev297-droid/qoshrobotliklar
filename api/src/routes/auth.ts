import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// POST /api/auth/login — admin panel uchun kirish
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Email va parol to'g'ri kiritilmadi" });
  }
  const { email, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ error: "Email yoki parol xato" });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: "Email yoki parol xato" });

  const token = jwt.sign(
    { sub: admin.id, role: admin.role, email: admin.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "12h" },
  );

  res.json({ token, admin: { id: admin.id, name: admin.name, role: admin.role } });
});

export default router;
