"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { CandyArt } from "@/lib/candyArt";
import { formatPrice } from "@/lib/CatalogProvider";
import type { Product } from "@/lib/apiClient";
import { gsap, prefersReducedMotion } from "@/hooks/useGsap";

export function FlavorCarousel({ flavors, currentId }: { flavors: Product[]; currentId: number }) {
  const router = useRouter();
  const artRef = useRef<HTMLDivElement>(null);
  const currentIndex = flavors.findIndex((f) => f.id === currentId);

  function go(next: 1 | -1) {
    if (currentIndex === -1) return;
    const total = flavors.length;
    const nextIndex = (currentIndex + next + total) % total;
    const nextFlavor = flavors[nextIndex];

    if (prefersReducedMotion() || !artRef.current) {
      router.push(`/product/${nextFlavor.id}`);
      return;
    }

    gsap.to(artRef.current, {
      x: next * -60,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => router.push(`/product/${nextFlavor.id}`),
    });
  }

  if (flavors.length <= 1) return null;

  return (
    <div className="mt-10" aria-label="Choose your flavor">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-purple">Choose Your Flavor</h3>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous flavor"
            onClick={() => go(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-navy text-navy hover:border-pink hover:text-pink"
          >
            ‹
          </button>
          <button
            aria-label="Next flavor"
            onClick={() => go(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-navy text-navy hover:border-pink hover:text-pink"
          >
            ›
          </button>
        </div>
      </div>

      <div ref={artRef} className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {flavors.map((f) => (
          <button
            key={f.id}
            onClick={() => router.push(`/product/${f.id}`)}
            className={`flex min-w-[110px] flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-colors ${
              f.id === currentId ? "border-pink bg-cream" : "border-navy/10 hover:border-navy/40"
            }`}
          >
            <CandyArt color={f.candyColor} id={`carousel-${f.id}`} className="h-14 w-14" />
            <span className="text-center text-xs font-bold text-navy">{f.name}</span>
            <span className="text-xs text-navy/60">{formatPrice(f.price)}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {flavors.map((f) => (
          <span
            key={f.id}
            className={`h-1.5 rounded-full transition-all ${
              f.id === currentId ? "w-6 bg-pink" : "w-1.5 bg-navy/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
