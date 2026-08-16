"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CandyArt } from "@/lib/candyArt";
import { useCatalog, formatPrice } from "@/lib/CatalogProvider";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { BundleCard } from "@/components/BundleCard";
import { gsap, prefersReducedMotion } from "@/hooks/useGsap";

const HEADLINE = "Cloud-Soft Cotton Candy";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const { products, categories, bundles } = useCatalog();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".letter-reveal", {
        y: 46,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.03,
      });
      gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.7, delay: 0.5, ease: "power3.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.7, delay: 0.65, ease: "power3.out" });
      gsap.fromTo(
        artRef.current,
        { opacity: 0, scale: 0.85, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1, delay: 0.2, ease: "power3.out" }
      );

      const onMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 24;
        const y = (e.clientY / innerHeight - 0.5) * 24;
        gsap.to(artRef.current, { x, y, duration: 0.6, ease: "power2.out" });
      };
      window.addEventListener("mousemove", onMove);

      return () => window.removeEventListener("mousemove", onMove);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Re-scanned once catalog data (categories/products/bundles) has arrived and rendered,
  // since these grids don't exist in the DOM yet on the initial mount-time scan above.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-gsap]").forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, [products, categories, bundles]);

  const featured = products.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden border-b-4 border-navy bg-cream">
        <div className="container-cs grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="flex flex-wrap font-display text-3xl font-extrabold leading-[1.15] text-navy sm:text-5xl sm:leading-[1.05] lg:text-6xl">
              {HEADLINE.split(" ").map((word, wi) => (
                <span key={wi} className="mr-[0.28em] inline-flex last:mr-0">
                  {word.split("").map((ch, i) => (
                    <span key={i} className="letter-reveal inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="hero-sub mt-6 max-w-md text-lg text-navy/70">
              Handcrafted flavor clouds made fresh in Nepal. Six signature flavors, zero gradients, 100% happiness.
            </p>
            <div className="hero-cta mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="rounded-full bg-pink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-transform hover:-translate-y-0.5">
                Shop Flavors
              </Link>
              <Link href="/about" className="rounded-full border-2 border-navy px-8 py-4 text-sm font-bold uppercase tracking-wide text-navy transition-transform hover:-translate-y-0.5">
                Our Story
              </Link>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-navy bg-white px-4 py-2 text-xs font-bold text-navy">
              <span className="h-2 w-2 rounded-full bg-lime" /> Cash on Delivery, all across Nepal
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-pink/10 sm:h-96 sm:w-96" />
            <div ref={artRef} className="relative h-72 w-72 sm:h-96 sm:w-96">
              <CandyArt color="#F90264" id="hero" className="h-full w-full drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-cs py-16">
        <div data-scroll-reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Browse</p>
            <h2 className="font-display text-3xl font-extrabold text-navy">Shop by Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-cream py-16">
        <div className="container-cs">
          <div data-scroll-reveal className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Best Sellers</p>
              <h2 className="font-display text-3xl font-extrabold text-navy">Featured Flavors</h2>
            </div>
            <Link href="/shop" className="hidden text-sm font-bold text-pink sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      {bundles.length > 0 && (
        <section className="container-cs py-16">
          <div data-scroll-reveal className="mb-8">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Better Together</p>
            <h2 className="font-display text-3xl font-extrabold text-navy">Bundle &amp; Save</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((b) => (
              <BundleCard key={b.id} bundle={b} />
            ))}
          </div>
        </section>
      )}

      {/* COD + features */}
      <section className="container-cs py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { title: "Cash on Delivery", desc: "Pay when it arrives — no card needed.", color: "bg-pink" },
            { title: "Made Fresh", desc: "Spun to order with premium ingredients.", color: "bg-orange" },
            { title: "Nationwide in Nepal", desc: "Kathmandu Valley and beyond.", color: "bg-cyan" },
          ].map((f) => (
            <div key={f.title} data-gsap className="rounded-[28px] border-2 border-navy p-6">
              <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${f.color} text-white`}>
                ✓
              </span>
              <h3 className="font-display text-lg font-bold text-navy">{f.title}</h3>
              <p className="mt-1 text-sm text-navy/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="bg-navy py-16 text-white">
        <div className="container-cs grid items-center gap-10 md:grid-cols-2">
          <div data-scroll-reveal>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Our Story</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">Welcome to Candy Station!</h2>
            <p className="mt-4 text-white/70">
              Candy Station was created with one goal: to bring joy, excitement, and unforgettable moments through
              premium confectionery. Every product is crafted with care, creativity, and attention to quality —
              designed to spread smiles and create sweet memories for people of all ages.
            </p>
            <Link href="/about" className="mt-6 inline-block rounded-full bg-pink px-7 py-3 text-sm font-bold uppercase tracking-wide">
              Read Our Story
            </Link>
          </div>
          <div data-scroll-reveal className="grid grid-cols-3 gap-3">
            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 p-3">
                <CandyArt color={p.candyColor} id={`about-${p.id}`} className="h-16 w-16" />
                <span className="text-center text-[11px] font-semibold text-white/80">{p.name}</span>
                <span className="text-[11px] text-gold">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
