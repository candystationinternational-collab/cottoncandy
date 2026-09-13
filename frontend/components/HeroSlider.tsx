"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CandyArt } from "@/lib/candyArt";
import type { HeroSlide } from "@/lib/apiClient";
import { gsap, prefersReducedMotion } from "@/hooks/useGsap";

const AUTO_ADVANCE_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lastSlideCount, setLastSlideCount] = useState(slides.length);

  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const bounceRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Clamp the active slide back in range if the slide list itself changes size (e.g. admin edits).
  if (slides.length !== lastSlideCount) {
    setLastSlideCount(slides.length);
    if (activeIndex >= slides.length) setActiveIndex(0);
  }

  const slide = slides[activeIndex];

  function go(index: number) {
    setActiveIndex(((index % slides.length) + slides.length) % slides.length);
  }

  // Auto-advance, paused on hover and disabled entirely under reduced motion.
  useEffect(() => {
    if (prefersReducedMotion() || slides.length <= 1 || paused) return;
    const t = setInterval(() => setActiveIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  // Continuous kid-friendly bounce/wobble loop on the art, running independent of slide changes.
  useEffect(() => {
    if (prefersReducedMotion() || !bounceRef.current) return;
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
    if (prefersReducedMotion() || !sectionRef.current) return;
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
    if (prefersReducedMotion() || !textRef.current) return;
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

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden border-b-4 border-navy transition-colors duration-700"
      style={{ backgroundColor: slide.backgroundColor }}
    >
      <div className="container-cs grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div key={slide.id} ref={textRef}>
          <h1 className="flex flex-wrap font-display text-3xl font-extrabold leading-[1.15] text-navy sm:text-5xl sm:leading-[1.05] lg:text-6xl">
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
          {slide.subtitle && <p className="hero-sub mt-6 max-w-md text-lg text-navy/70">{slide.subtitle}</p>}
          <div className="hero-cta mt-8 flex flex-wrap gap-4">
            <Link
              href={slide.linkUrl}
              className="rounded-full bg-pink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-transform hover:-translate-y-0.5"
            >
              {slide.ctaLabel}
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-navy px-8 py-4 text-sm font-bold uppercase tracking-wide text-navy transition-transform hover:-translate-y-0.5"
            >
              Our Story
            </Link>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-navy bg-white px-4 py-2 text-xs font-bold text-navy">
            <span className="h-2 w-2 rounded-full bg-lime" /> Cash on Delivery, all across Nepal
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-white/20 sm:h-96 sm:w-96" />
          <div ref={parallaxRef} className="relative h-72 w-72 sm:h-96 sm:w-96">
            <div ref={bounceRef} className="h-full w-full">
              <div key={slide.id} ref={artRef} className="h-full w-full">
                {image ? (
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
                className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-8 bg-navy" : "w-2 bg-navy/25 hover:bg-navy/50"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => go(activeIndex - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy text-navy hover:border-pink hover:text-pink"
            >
              ‹
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(activeIndex + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy text-navy hover:border-pink hover:text-pink"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
