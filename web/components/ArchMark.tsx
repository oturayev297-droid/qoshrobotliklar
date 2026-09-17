// "Qo'sh rabot" — yonma-yon ikki karvonsaroy ravog'i
export default function ArchMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <path d="M5 35V19a7.5 7.5 0 0 1 15 0v16" stroke="currentColor" strokeWidth="2.6" />
      <path d="M20 35V19a7.5 7.5 0 0 1 15 0v16" stroke="currentColor" strokeWidth="2.6" />
      <path d="M2 35.5h36" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
