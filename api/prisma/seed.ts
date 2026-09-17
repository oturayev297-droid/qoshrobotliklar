import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/db";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@qoshrabot.uz";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Bosh moderator",
      role: "ADMIN",
    },
  });

  // Diqqatga sazovor joy — tasdiqlangan arxeologik topilma (manba: oyina.uz maqolasi)
  await prisma.place.upsert({
    where: { id: "seed-temir-darvoza" },
    update: {},
    create: {
      id: "seed-temir-darvoza",
      title: "Sug'd Temir Darvozasi (arxeologik yodgorlik)",
      type: "Tarixiy",
      description:
        "Qo'shrabot hududida topilgan, Buxoro-Nurota-Jo'sh karvon yo'lini nazorat qilgan ikkita qadimiy qal'a majmuasi. XII-XIII asrlarga oid sopol topilmalar aniqlangan. Tarixiy manbalarda 1582-yilda Abdullaxon qo'shini shu yo'ldan o'tgani qayd etilgan.",
      status: "APPROVED",
      featured: true,
    },
  });

  console.log("Seed muvaffaqiyatli yakunlandi. Admin:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
