"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CandyArt } from "@/lib/candyArt";
import type { HeroSlide } from "@/lib/apiClient";
import { formatPrice, useCatalog } from "@/lib/CatalogProvider";
import { useCart } from "@/lib/cartStore";
import { gsap } from "@/hooks/useGsap";

const AUTO_ADVANCE_MS = 6000;

/** True if a hex background is dark enough that navy text/borders would lose contrast. */
function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const { products } = useCatalog();
  const { addProduct, addBundle } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lastSlideCount, setLastSlideCount] = useState(slides.length);

  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const bounceRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  // Clamp the active slide back in range if the slide list itself changes size (e.g. admin edits).
  if (slides.length !== lastSlideCount) {
    setLastSlideCount(slides.length);
    if (activeIndex >= slides.length) setActiveIndex(0);
  }

  const slide = slides[activeIndex];

  function go(index: number) {
    setActiveIndex(((index % slides.length) + slides.length) % slides.length);
  }

  // Auto-advance, paused on hover. The hero's motion is intentionally always-on (unlike the rest
  // of the site) regardless of prefers-reduced-motion, per explicit product decision.
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(() => setActiveIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  // Continuous kid-friendly bounce/wobble loop on the art, running independent of slide changes.
  useEffect(() => {
    if (!bounceRef.current) return;
    const tween = gsap.to(bounceRef.current, {
      y: -14,
      rotate: 3,
      duration: 1.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  // Mouse parallax on the whole art stack (same feel as the original static hero).
  useEffect(() => {
    if (!sectionRef.current) return;
    function onMove(e: MouseEvent) {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 24;
      const y = (e.clientY / innerHeight - 0.5) * 24;
      gsap.to(parallaxRef.current, { x, y, duration: 0.6, ease: "power2.out" });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Per-slide entrance: headline letters, subtitle, CTA, and a fresh art pop-in.
  useEffect(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".letter-reveal", { y: 46, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.03 });
      gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.7, delay: 0.45, ease: "power3.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.7, delay: 0.6, ease: "power3.out" });
    }, textRef);

    if (artRef.current) {
      gsap.fromTo(
        artRef.current,
        { opacity: 0, scale: 0.85, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.9, delay: 0.15, ease: "power3.out" }
      );
    }

    return () => ctx.revert();
  }, [activeIndex]);

  if (!slide) return null;

  const image = slide.images[0];
  const dark = isDarkColor(slide.backgroundColor);
  const textColor = dark ? "text-white" : "text-navy";
  const subColor = dark ? "text-white/75" : "text-navy/70";
  const outlineBtn = dark ? "border-white text-white" : "border-navy text-navy";
  const dotActive = dark ? "bg-white" : "bg-navy";
  const dotInactive = dark ? "bg-white/30 hover:bg-white/60" : "bg-navy/25 hover:bg-navy/50";
  const arrowBtn = dark ? "border-white text-white hover:border-pink hover:text-pink" : "border-navy text-navy hover:border-pink hover:text-pink";

  function handleAddToCart() {
    if (addToCartRef.current) {
      gsap.fromTo(
        addToCartRef.current,
        { scale: 1 },
        { scale: 1.18, duration: 0.12, ease: "power1.out", yoyo: true, repeat: 1 }
      );
    }
    if (slide.itemType === "bundle" && slide.bundleId) {
      addBundle(slide.bundleId, 1);
      return;
    }
    if (slide.productId) {
      const product = products.find((p) => p.id === slide.productId);
      const variant = product?.variants[0];
      if (variant) addProduct(product!.id, variant.id, 1);
    }
  }

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden border-b-4 border-navy transition-colors duration-700"
      style={{ backgroundColor: slide.backgroundColor }}
    >
      <div className="container-cs grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div key={slide.id} ref={textRef} className="order-2 md:order-1">
          <h1 className={`flex flex-wrap font-display text-3xl font-extrabold leading-[1.15] sm:text-5xl sm:leading-[1.05] lg:text-6xl ${textColor}`}>
            {slide.title.split(" ").map((word, wi) => (
              <span key={wi} className="mr-[0.28em] inline-flex last:mr-0">
                {word.split("").map((ch, i) => (
                  <span key={i} className="letter-reveal inline-block">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          {slide.subtitle && <p className={`hero-sub mt-6 max-w-md text-lg ${subColor}`}>{slide.subtitle}</p>}

          <div className="hero-sub mt-4 flex items-center gap-3">
            <span className="font-display text-2xl font-extrabold text-pink">{formatPrice(slide.price)}</span>
            {slide.compareAtPrice && (
              <span className={`text-sm line-through ${dark ? "text-white/40" : "text-navy/40"}`}>{formatPrice(slide.compareAtPrice)}</span>
            )}
          </div>

          <div className="hero-cta mt-6 flex flex-wrap gap-4">
            <button
              ref={addToCartRef}
              onClick={handleAddToCart}
              className="rounded-full bg-pink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              Add to Cart
            </button>
            <Link
              href={slide.linkUrl}
              className={`rounded-full border-2 px-8 py-4 text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5 active:scale-95 ${outlineBtn}`}
            >
              {slide.ctaLabel}
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-white px-4 py-2 text-xs font-bold text-navy">
              <span className="h-2 w-2 rounded-full bg-lime" /> Cash on Delivery, all across Nepal
            </div>
            <Link href="/about" className={`text-xs font-bold uppercase tracking-wide underline underline-offset-4 ${textColor}`}>
              Our Story
            </Link>
          </div>
        </div>

        <div className="relative order-1 flex items-center justify-center md:order-2">
          <div className="absolute h-72 w-72 rounded-full opacity-15 sm:h-96 sm:w-96" style={{ backgroundColor: slide.candyColor }} />
          <div ref={parallaxRef} className="relative h-72 w-72 sm:h-96 sm:w-96">
            <div ref={bounceRef} className="h-full w-full">
              <div key={slide.id} ref={artRef} className="h-full w-full">
                {slide.itemType === "bundle" && slide.items.length > 0 ? (
                  <div className="flex h-full w-full flex-wrap content-center items-center justify-center">
                    {slide.items.slice(0, 6).map((item) => (
                      <div key={item.productId} className="relative aspect-square w-1/3 p-1.5">
                        <div className="absolute inset-3 rounded-full opacity-20" style={{ backgroundColor: item.candyColor }} />
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill unoptimized sizes="120px" className="object-contain p-1 drop-shadow-lg" />
                        ) : (
                          <CandyArt color={item.candyColor} id={`hero-item-${slide.id}-${item.productId}`} className="h-full w-full drop-shadow-lg" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : image ? (
                  <div className="relative h-full w-full">
                    <Image src={image} alt={slide.title} fill unoptimized sizes="(min-width: 640px) 24rem, 18rem" className="object-contain drop-shadow-2xl" />
                  </div>
                ) : (
                  <CandyArt color={slide.candyColor} id={`hero-${slide.id}`} className="h-full w-full drop-shadow-2xl" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="container-cs flex items-center justify-between pb-8">
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${i === activeIndex ? `w-8 ${dotActive}` : `w-2 ${dotInactive}`}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => go(activeIndex - 1)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${arrowBtn}`}
            >
              ‹
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(activeIndex + 1)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${arrowBtn}`}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
