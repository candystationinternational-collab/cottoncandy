"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalog } from "@/lib/CatalogProvider";
import { ProductCard } from "@/components/ProductCard";
import { gsap, prefersReducedMotion } from "@/hooks/useGsap";

type SortKey = "price-asc" | "price-desc" | "rating" | "name";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat");
  const { products, categories } = useCatalog();

  const [selectedCats, setSelectedCats] = useState<number[]>(initialCat ? [Number(initialCat)] : []);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("name");
  const gridRef = useRef<HTMLDivElement>(null);

  const allTags = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.flavorTags))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (selectedCats.length) list = list.filter((p) => selectedCats.includes(p.categoryId));
    if (selectedTags.length) list = list.filter((p) => p.flavorTags.some((t) => selectedTags.includes(t)));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          p.flavorTags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [products, selectedCats, selectedTags, search, maxPrice, sort]);

  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current!.children, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.06,
      });
    });
    return () => ctx.revert();
  }, [filtered]);

  function toggleCat(id: number) {
    setSelectedCats((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <div className="container-cs py-12">
      <div className="mb-8">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Shop</p>
        <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">All Flavors</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters */}
        <aside className="space-y-8">
          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">Search</h3>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flavors..."
              className="w-full rounded-full border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
            />
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">Category</h3>
            <div className="space-y-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm text-navy/80">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(c.id)}
                    onChange={() => toggleCat(c.id)}
                    className="h-4 w-4 accent-pink"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">
              Max Price: Rs. {maxPrice}
            </h3>
            <input
              type="range"
              min={200}
              max={500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-pink"
            />
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">Flavor Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    selectedTags.includes(tag)
                      ? "border-pink bg-pink text-white"
                      : "border-navy/20 text-navy/70 hover:border-navy"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-navy/60">{filtered.length} flavors</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm font-semibold text-navy focus:border-pink focus:outline-none"
            >
              <option value="name">Name (A–Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-navy/20 p-12 text-center text-navy/60">
              No flavors match your filters.
            </p>
          ) : (
            <div ref={gridRef} className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
