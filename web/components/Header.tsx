"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ArchMark from "@/components/ArchMark";

const NAV = [
  { href: "/tarix", label: "Tarix" },
  { href: "/mashhur-kishilar", label: "Mashhur kishilar" },
  { href: "/diqqatga-sazovor-joylar", label: "Joylar" },
  { href: "/galereya", label: "Galereya" },
  { href: "/yangiliklar", label: "Yangiliklar" },
  { href: "/aloqa", label: "Aloqa" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-qor-50/10 bg-tun-950/55 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <ArchMark className="h-9 w-9 text-zar-400" />
          <span className="font-display text-base font-bold tracking-tight text-qor-50">Qo&#39;shrabotliklar</span>
        </Link>

        <nav aria-label="Asosiy menyu" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? "bg-qor-50/10 text-zar-300" : "text-qor-100/80 hover:text-qor-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/mashhur-kishilar/taklif" className="btn-primary hidden !py-2.5 lg:inline-flex">
          Ma&#39;lumot qo&#39;shish
        </Link>

        <button
          aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-qor-50/20 text-qor-50 lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-qor-50/10 bg-tun-950/95 px-5 pb-6 pt-2 lg:hidden">
          <nav aria-label="Mobil menyu" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`border-b border-qor-50/5 py-3.5 text-base font-medium ${
                  isActive(item.href) ? "text-zar-300" : "text-qor-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/mashhur-kishilar/taklif" onClick={() => setOpen(false)} className="btn-primary mt-5">
              Ma&#39;lumot qo&#39;shish
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
