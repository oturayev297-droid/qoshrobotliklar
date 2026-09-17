import { PrismaClient } from "@prisma/client";

// Railway kabi serverless-ga yaqin muhitlarda bitta PrismaClient instansiyasini
// qayta ishlatish uchun global cache (hot-reload paytida ko'p ulanish ochilishining oldini oladi)
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
