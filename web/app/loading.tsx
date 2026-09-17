// Sahifa serverdan kelguncha darhol ko'rinadigan holat: havola bosilgach ekran "qotib" qolmaydi.
// 3D fon esa shu vaqtda ham yangi sahifa joyiga uchishda davom etadi.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="h-10 w-2/3 max-w-xl animate-pulse rounded-xl bg-qor-50/10 sm:h-14" />
      <div className="mt-5 h-5 w-full max-w-2xl animate-pulse rounded-lg bg-qor-50/10" />
      <div className="mt-3 h-5 w-4/5 max-w-xl animate-pulse rounded-lg bg-qor-50/10" />
      <span className="sr-only">Sahifa yuklanmoqda</span>
    </div>
  );
}
