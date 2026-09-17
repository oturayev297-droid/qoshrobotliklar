"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Landscape } from "@/lib/scene/landscape";

// Butun sayt ortidagi 3D manzara. three.js alohida chunk sifatida faqat brauzerda yuklanadi.
// Sahna bir marta yaratiladi; sahifa almashganda faqat kamera yangi sahifa joyiga uchadi.
export default function SceneBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landscapeRef = useRef<Landscape | null>(null);
  const pathnameRef = useRef(pathname);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    pathnameRef.current = pathname;
    landscapeRef.current?.setRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onScroll = () => landscapeRef.current?.setProgress(progress());

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;

    import("@/lib/scene/landscape")
      .then(({ createLandscape }) => {
        if (cancelled) return;
        try {
          landscapeRef.current = createLandscape(canvas, {
            reducedMotion,
            lowPower,
            pathname: pathnameRef.current,
          });
        } catch {
          // WebGL mavjud emas — CSS gradient fon qoladi
          return;
        }
        landscapeRef.current.setProgress(progress());
        setReady(true);
      })
      .catch(() => {});

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Sahifa almashganda yoki kontent yuklanganda balandlik o'zgaradi
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      landscapeRef.current?.dispose();
      landscapeRef.current = null;
    };
  }, []);

  return (
    <div aria-hidden className="scene-fallback fixed inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
