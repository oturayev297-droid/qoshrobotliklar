# Qo'shrabotliklar.uz

Samarqand viloyati **Qo'shrabot tumani** va uning odamlari haqidagi hamjamiyat sayti. Tuman tarixi, taniqli qo'shrabotliklar, diqqatga sazovor joylar va yangiliklarni bir joyda jamlaydigan, jamoat tomonidan to'ldiriladigan zamonaviy portal.

Loyiha ikki qismdan iborat monorepo:

```
qoshrabotliklar/
├── web/    → Next.js 14 frontend (Vercel'ga deploy qilinadi)
└── api/    → Express + Prisma + PostgreSQL backend (Railway'ga deploy qilinadi)
```

## 1. Arxitektura

**Frontend (`web/`)** — Next.js 14 (App Router) + TypeScript + Tailwind CSS. Server komponentlar orqali backend API'dan ma'lumot oladi (SSR, 60 soniyalik revalidatsiya bilan). Backend hali ishlamasa ham sayt qulamaydi — har bir so'rov xavfsiz fallback qiymat bilan ishlaydi.

**Backend (`api/`)** — Express + TypeScript + Prisma ORM + PostgreSQL. Ommaga ochiq `GET` endpointlar va jamoat a'zolari tomonidan yuboriladigan "taklif qilish" formalari (moderatsiyaga tushadi), shuningdek JWT bilan himoyalangan admin endpointlar (tasdiqlash/rad etish, yangilik qo'shish).

**Nima uchun ikki xizmat?** Frontend statik/SSR sahifalar sifatida Vercel'ning global CDN'ida tez ishlaydi; backend esa doimiy PostgreSQL ulanishi va fayl/route logikasi talab qiladigan CRUD operatsiyalar uchun Railway'da alohida joylashadi.

### Sahifalar

| Yo'l | Tavsif |
|---|---|
| `/` | Bosh sahifa — statistika, ajratilgan mashhur kishilar/joylar, so'nggi yangiliklar |
| `/tarix` | Tuman tarixi, nom etimologiyasi, Sug'd Temir Darvozasi haqidagi arxeologik topilma, vaqt chizig'i |
| `/mashhur-kishilar` | Taniqli qo'shrabotliklar katalogi (jamoat to'ldiradi, moderatsiyadan o'tadi) |
| `/mashhur-kishilar/taklif` | Yangi shaxsni taklif qilish formasi |
| `/diqqatga-sazovor-joylar` | Tarixiy/tabiiy joylar katalogi |
| `/galereya` | Suratlar galereyasi |
| `/yangiliklar` va `/yangiliklar/[slug]` | Yangiliklar ro'yxati va bitta maqola |
| `/aloqa` | Aloqa formasi + hokimlik rasmiy kontaktlari |

### Dizayn yo'nalishi

Zamonaviy, iliq "Ipak yo'li" uslubi: qumga o'xshash fon (`sand`), sopol/tuproq rangidagi urg'u (`clay`), chuqur ko'k-yashil (`deep`) — Qo'shrabotning cho'l-dasht landshafti va mintaqadagi qadimiy koshinkorlik ranglaridan ilhomlangan. Tipografiya: sarlavhalar uchun **Manrope** (qalin, zamonaviy), matn uchun **Inter**.

## 2. Tadqiqot manbalari

Tumandagi mavjud faktlar quyidagi ochiq manbalardan yig'ildi va sayt kontentiga (asosan `/tarix` sahifasi va `api/src/routes/district.ts`) joylandi:

- [Qo'shrabot tumani — Samarqand viloyati hokimligi sayti](https://samarkand.uz/towns_districts/koshrabat)
- [Qo'shrabot tumani hokimligi (gov.uz)](https://gov.uz/oz/qoshrabot)
- [Qo'shrabot — en.wikipedia.org](https://en.wikipedia.org/wiki/Qo%CA%BBshrabot)
- [Sug'dning shimoliy temir darvozasi topildi — oyina.uz](https://oyina.uz/uz/article/508)

**Muhim eslatma:** ochiq manbalarda Qo'shrabotdan chiqqan aniq taniqli shaxslar (ism-familiyalari bilan) haqida tasdiqlangan ma'lumot topilmadi, shuning uchun bunday ismlar **o'ylab topilmadi**. Buning o'rniga sayt "Mashhur kishilar" bo'limini hamjamiyat o'zi to'ldiradigan, moderatsiyadan o'tadigan katalog sifatida qurdim (`/mashhur-kishilar/taklif`) — bu haqiqiy va tekshirilishi mumkin bo'lgan ma'lumot bilan ishlashning to'g'ri yo'li.

## 3. Mahalliy ishga tushirish

### Backend

```bash
cd api
cp .env.example .env      # DATABASE_URL va JWT_SECRET'ni to'ldiring
npm install
npx prisma migrate dev          # tayyor migratsiyalarni qo'llaydi
npm run seed               # birinchi admin foydalanuvchi va namunaviy joy yaratadi
npm run dev                 # http://localhost:4000
```

### Frontend

```bash
cd web
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                 # http://localhost:3000
```

## 4. Railway'ga backend deploy qilish

1. [railway.com](https://railway.com) da yangi loyiha → **Deploy from GitHub repo** → shu repozitoriyani tanlang.
2. Xizmat **Settings** bo'limida:
   - **Root Directory** = `/api`
   - **Config-as-code → Railway Config File** = `/api/railway.json` (Railway bu faylni Root Directory ichidan o'zi qidirmaydi, yo'lni to'liq ko'rsatish kerak)
3. Loyihaga **+ New → Database → PostgreSQL** qo'shing.
4. Backend xizmatining **Variables** bo'limida:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (Reference Variable orqali ulang)
   - `JWT_SECRET` — uzun tasodifiy satr (`openssl rand -base64 48`). **Majburiy**: production'da bo'lmasa server ishga tushmaydi.
   - `CORS_ORIGIN` — Vercel domeningiz, masalan `https://qoshrabotliklar.vercel.app` (bir nechta bo'lsa vergul bilan)
   - `NODE_ENV=production`
   - `PORT` qo'ymang — Railway o'zi beradi.
5. `railway.json` bo'yicha: build `npm install --include=dev && npm run build`, har deploy oldidan `npx prisma migrate deploy` (pre-deploy — `prisma/migrations` dagi jadvallarni yaratadi), so'ng `npm start`. Health-check: `/health`.
6. **Settings → Networking → Generate Domain** bosing va manzilni nusxalang (masalan `https://qoshrabotliklar-api.up.railway.app`).
7. Birinchi admin uchun lokal kompyuterda: `railway link` → `railway run npm run seed` (yoki `DATABASE_URL`ga Postgres'ning **public** URL'ini qo'yib `npm run seed`).

## 5. Vercel'ga frontend deploy qilish

1. [vercel.com](https://vercel.com) → **Add New → Project** → shu repozitoriyani import qiling.
2. **Root Directory** = `web` (Framework: Next.js avtomatik aniqlanadi).
3. **Environment Variables**: `NEXT_PUBLIC_API_URL` = Railway manzili, **oxirida `/` siz** (masalan `https://qoshrabotliklar-api.up.railway.app`).
   `NEXT_PUBLIC_*` qiymatlar build vaqtida kodga yoziladi — uni o'zgartirsangiz **Redeploy** qiling.
4. **Deploy**. So'ng Vercel domenini Railway'dagi `CORS_ORIGIN` ga qo'shing.
5. (Ixtiyoriy) O'z domeningizni ulang va uni ham `CORS_ORIGIN` ga qo'shing.

**Deploy tartibi:** avval Railway (backend URL kerak) → keyin Vercel → oxirida Railway'da `CORS_ORIGIN`ni yangilash.

## 6. Admin panel haqida

Bu versiyada admin **API** to'liq tayyor (`/api/auth/login`, keyin `Authorization: Bearer <token>` bilan `POST/PATCH/DELETE` so'rovlari), ammo alohida admin UI hali qo'shilmagan — moderatsiyani hozircha `curl`/Postman yoki oddiy fetch skripti orqali amalga oshirish mumkin. Masalan, kishini tasdiqlash:

```bash
curl -X PATCH https://<api-domen>/api/people/<id>/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED","featured":true}'
```

Keyingi bosqichda oddiy `/admin` sahifasini (login + ro'yxat + tasdiqlash tugmalari) qo'shish tavsiya etiladi — buni alohida so'rov sifatida beraverishingiz mumkin.

## 7. Texnik stek

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod (validatsiya), JWT (autentifikatsiya), Helmet + rate-limit (xavfsizlik)
- **Deploy:** Vercel (frontend), Railway (backend + PostgreSQL)
