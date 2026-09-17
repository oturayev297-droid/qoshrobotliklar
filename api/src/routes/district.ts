import { Router } from "express";

const router = Router();

// Tuman haqida statik, tekshirilgan ma'lumotlar (rasmiy manbalar: samarkand.uz, gov.uz/oz/qoshrabot,
// uz.wikipedia.org/wiki/Qo'shrabot_tumani — 2024-yil holatiga ko'ra)
router.get("/", (_req, res) => {
  res.json({
    name: "Qo'shrabot tumani",
    region: "Samarqand viloyati",
    founded: "1978-yil 3-aprel",
    center: "Qo'shrabot shaharchasi",
    areaKm2: 2160,
    population: {
      total: 141851,
      male: 72397,
      female: 69454,
      asOf: "2024-01-01",
    },
    administrative: {
      urbanSettlements: 2,
      neighborhoods: 45,
      villages: 137,
    },
    borders: ["Navoiy viloyati", "Jizzax viloyati", "Kattaqo'rg'on tumani", "Ishtixon tumani", "Payariq tumani"],
    nameOrigin:
      "\"Qo'sh\" (juft) va \"Rabot\" (karvonsaroy) so'zlaridan — yonma-yon qurilgan ikkita qadimiy karvonsaroy joylashgan hudud.",
    contact: {
      phone: "(66) 646-15-18",
      email: "info@qoshrabot.uz",
    },
  });
});

export default router;
