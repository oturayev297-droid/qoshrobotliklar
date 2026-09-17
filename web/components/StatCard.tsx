export default function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-sand-50 p-5 text-center shadow-soft sm:p-6">
      <div className="font-display text-2xl font-extrabold text-deep-700 sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-800/60 sm:text-sm">{label}</div>
    </div>
  );
}
