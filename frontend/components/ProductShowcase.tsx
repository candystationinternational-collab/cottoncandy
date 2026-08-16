"use client";

import { useEffect, useRef } from "react";
import { CandyArt } from "@/lib/candyArt";
import { gsap, prefersReducedMotion } from "@/hooks/useGsap";

export function ProductShowcase({ color, productId }: { color: string; productId: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !wrapRef.current || !artRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        artRef.current,
        { y: 40, rotate: -4, scale: 0.92, opacity: 0 },
        { y: 0, rotate: 0, scale: 1, opacity: 1, duration: 1, ease: "power3.out" }
      );

      gsap.to(artRef.current, {
        y: -24,
        rotate: 5,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [productId]);

  return (
    <div ref={wrapRef} className="relative flex items-center justify-center py-6">
      <div className="absolute h-72 w-72 rounded-full opacity-15" style={{ backgroundColor: color }} />
      <div ref={artRef} className="relative h-80 w-80 sm:h-96 sm:w-96">
        <CandyArt color={color} id={`showcase-${productId}`} className="h-full w-full drop-shadow-xl" />
      </div>
    </div>
  );
}
