"use client";

import { useEffect, useRef, useState } from "react";
import type { Landscape } from "@/lib/scene/landscape";

// Butun sayt ortidagi 3D manzara. three.js alohida chunk sifatida faqat brauzerda yuklanadi.
export default function SceneBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let landscape: Landscape | null = null;
    let cancelled = false;

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onScroll = () => landscape?.setProgress(progress());

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;

    import("@/lib/scene/landscape")
      .then(({ createLandscape }) => {
        if (cancelled) return;
        try {
          landscape = createLandscape(canvas, { reducedMotion, lowPower });
        } catch {
          // WebGL mavjud emas — CSS gradient fon qoladi
          return;
        }
        landscape.setProgress(progress());
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
      landscape?.dispose();
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
