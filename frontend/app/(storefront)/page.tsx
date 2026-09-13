"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CandyArt } from "@/lib/candyArt";
import { useCatalog, formatPrice } from "@/lib/CatalogProvider";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { BundleCard } from "@/components/BundleCard";
import { HeroSlider } from "@/components/HeroSlider";
import { gsap, prefersReducedMotion } from "@/hooks/useGsap";

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { products, categories, bundles, heroSlides } = useCatalog();

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
    }, pageRef);

    return () => ctx.revert();
  }, [products, categories, bundles]);

  const featured = products.slice(0, 6);

  return (
    <div ref={pageRef}>
      {/* Hero */}
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

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
