"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CandyArt } from "@/lib/candyArt";
import { gsap, prefersReducedMotion } from "@/hooks/useGsap";

export function ProductShowcase({
  color,
  productId,
  images = [],
}: {
  color: string;
  productId: number;
  images?: string[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastProductId, setLastProductId] = useState(productId);

  // Reset the selected photo when navigating to a different product — adjusting state during
  // render (rather than in an effect) per React's guidance for resetting state on prop change.
  if (productId !== lastProductId) {
    setLastProductId(productId);
    setActiveIndex(0);
  }

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

  const activeImage = images[activeIndex];

  return (
    <div ref={wrapRef} className="relative flex flex-col items-center py-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-80 w-80 rounded-full opacity-15 sm:h-[26rem] sm:w-[26rem]" style={{ backgroundColor: color }} />
        <div ref={artRef} className="relative h-96 w-96 sm:h-[28rem] sm:w-[28rem]">
          {activeImage ? (
            <Image src={activeImage} alt="Product photo" fill unoptimized sizes="(min-width: 640px) 28rem, 24rem" className="object-contain drop-shadow-xl" />
          ) : (
            <CandyArt color={color} id={`showcase-${productId}`} className="h-full w-full drop-shadow-xl" />
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-colors ${
                i === activeIndex ? "border-pink" : "border-navy/15 hover:border-navy/40"
              }`}
            >
              <Image src={img} alt="" fill unoptimized className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
