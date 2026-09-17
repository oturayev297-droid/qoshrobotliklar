"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/tarix", label: "Tarix" },
  { href: "/mashhur-kishilar", label: "Mashhur kishilar" },
  { href: "/diqqatga-sazovor-joylar", label: "Diqqatga sazovor joylar" },
  { href: "/galereya", label: "Galereya" },
  { href: "/yangiliklar", label: "Yangiliklar" },
  { href: "/aloqa", label: "Aloqa" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200/70 bg-sand-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-deep-700 text-lg font-bold text-sand-50 shadow-soft">
            Q&#39;
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-extrabold text-ink-900">Qo&#39;shrabotliklar</span>
            <span className="text-xs font-medium text-ink-800/60">Qo&#39;shrabot tumani hamjamiyati</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-800/80 transition hover:bg-sand-100 hover:text-clay-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/mashhur-kishilar/taklif"
            className="rounded-full bg-clay-500 px-5 py-2.5 text-sm font-bold text-sand-50 shadow-soft transition hover:bg-clay-600"
          >
            Taklif qilish
          </Link>
        </div>

        <button
          aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-sand-200 text-ink-900 lg:hidden"
        >
          <span className="sr-only">Menyu</span>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-sand-200 bg-sand-50 px-5 pb-5 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-ink-900 hover:bg-sand-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/mashhur-kishilar/taklif"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-clay-500 px-5 py-3 text-center text-base font-bold text-sand-50"
            >
              Taklif qilish
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
