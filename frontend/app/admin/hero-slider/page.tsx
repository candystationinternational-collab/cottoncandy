"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi, type HeroSlideWrite } from "@/lib/adminApi";
import { CandyArt } from "@/lib/candyArt";
import type { Bundle, HeroSlide, Product } from "@/lib/apiClient";

const EMPTY: HeroSlideWrite = {
  itemType: "product",
  productId: null,
  bundleId: null,
  backgroundColor: "#FFF4F8",
  titleOverride: "",
  subtitleOverride: "",
  ctaLabel: "",
  displayOrder: 0,
  status: "active",
};

export default function AdminHeroSliderPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<HeroSlideWrite>(EMPTY);
  const [error, setError] = useState("");

  function load() {
    Promise.all([adminApi.getHeroSlides(), adminApi.getProducts(), adminApi.getBundles()]).then(([s, p, b]) => {
      setSlides(s);
      setProducts(p);
      setBundles(b);
    });
  }
  useEffect(load, []);

  function openNew() {
    setForm({
      ...EMPTY,
      productId: products[0]?.id ?? null,
      displayOrder: slides.length + 1,
    });
    setEditingId("new");
    setError("");
  }

  function openEdit(s: HeroSlide) {
    setForm({
      itemType: s.itemType,
      productId: s.productId,
      bundleId: s.bundleId,
      backgroundColor: s.backgroundColor,
      titleOverride: s.titleOverride,
      subtitleOverride: s.subtitleOverride,
      ctaLabel: s.ctaLabelOverride,
      displayOrder: s.displayOrder,
      status: s.status,
    });
    setEditingId(s.id);
    setError("");
  }

  async function save() {
    setError("");
    if (form.itemType === "product" && !form.productId) {
      setError("Choose a product for this slide.");
      return;
    }
    if (form.itemType === "bundle" && !form.bundleId) {
      setError("Choose a bundle for this slide.");
      return;
    }
    try {
      if (editingId === "new") await adminApi.createHeroSlide(form);
      else if (typeof editingId === "number") await adminApi.updateHeroSlide(editingId, form);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save slide.");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this hero slide?")) return;
    await adminApi.deleteHeroSlide(id);
    load();
  }

  async function move(id: number, direction: -1 | 1) {
    const sorted = [...slides].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((s) => s.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    await Promise.all([
      adminApi.reorderHeroSlide(sorted[idx].id, sorted[swapIdx].displayOrder),
      adminApi.reorderHeroSlide(sorted[swapIdx].id, sorted[idx].displayOrder),
    ]);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy">Hero Slider</h1>
          <p className="mt-1 text-sm text-navy/60">Slides shown on the home page hero, in order. Each links to a product or bundle already in your catalog.</p>
        </div>
        <button onClick={openNew} disabled={products.length === 0} className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-pink disabled:opacity-40">
          + Add Slide
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...slides]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((s) => (
            <div key={s.id} className="overflow-hidden rounded-2xl border-2 border-navy/10 bg-white">
              <div className="flex h-28 items-center justify-center" style={{ backgroundColor: s.backgroundColor }}>
                <div className="relative h-20 w-20">
                  {s.images[0] ? (
                    <Image src={s.images[0]} alt={s.title} fill unoptimized sizes="80px" className="object-contain" />
                  ) : (
                    <CandyArt color={s.candyColor} id={`admin-hero-${s.id}`} className="h-full w-full" />
                  )}
                </div>
              </div>
              <div className="p-5">
                <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/50">
                  {s.itemType}
                </span>
                <h3 className="mt-2 font-display font-bold text-navy">{s.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-navy/60">{s.subtitle}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex gap-1">
                    <button onClick={() => move(s.id, -1)} className="rounded border border-navy/20 px-2 py-1 text-navy hover:border-navy">
                      ↑
                    </button>
                    <button onClick={() => move(s.id, 1)} className="rounded border border-navy/20 px-2 py-1 text-navy hover:border-navy">
                      ↓
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(s)} className="font-bold text-navy hover:text-pink">
                      Edit
                    </button>
                    <button onClick={() => remove(s.id)} className="font-bold text-pink">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {slides.length === 0 && (
        <p className="mt-8 text-sm text-navy/50">No hero slides yet. Add one to feature a product or bundle on the home page.</p>
      )}

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">{editingId === "new" ? "Add Slide" : "Edit Slide"}</h2>
            {error && <p className="mb-4 rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-navy/60">Feature</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, itemType: "product", bundleId: null, productId: form.productId ?? products[0]?.id ?? null })}
                    className={`flex-1 rounded-xl border-2 py-2 text-sm font-bold ${form.itemType === "product" ? "border-pink bg-pink/5 text-pink" : "border-navy/20 text-navy/60"}`}
                  >
                    Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, itemType: "bundle", productId: null, bundleId: form.bundleId ?? bundles[0]?.id ?? null })}
                    className={`flex-1 rounded-xl border-2 py-2 text-sm font-bold ${form.itemType === "bundle" ? "border-pink bg-pink/5 text-pink" : "border-navy/20 text-navy/60"}`}
                  >
                    Bundle
                  </button>
                </div>
              </div>

              {form.itemType === "product" ? (
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Product</label>
                  <select
                    value={form.productId ?? ""}
                    onChange={(e) => setForm({ ...form, productId: Number(e.target.value) })}
                    className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Bundle</label>
                  <select
                    value={form.bundleId ?? ""}
                    onChange={(e) => setForm({ ...form, bundleId: Number(e.target.value) })}
                    className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                  >
                    {bundles.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.backgroundColor}
                    onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                    className="h-10 w-14 rounded-lg border-2 border-navy/20"
                  />
                  <span className="text-sm text-navy/60">{form.backgroundColor}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Headline Override (optional)</label>
                <input
                  value={form.titleOverride ?? ""}
                  onChange={(e) => setForm({ ...form, titleOverride: e.target.value || null })}
                  placeholder="Leave blank to use the product/bundle name"
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Subtitle Override (optional)</label>
                <textarea
                  value={form.subtitleOverride ?? ""}
                  onChange={(e) => setForm({ ...form, subtitleOverride: e.target.value || null })}
                  rows={2}
                  placeholder="Leave blank to use the product/bundle description"
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">CTA Button Label (optional)</label>
                <input
                  value={form.ctaLabel ?? ""}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value || null })}
                  placeholder={form.itemType === "bundle" ? "Shop Bundles" : "Shop Now"}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold uppercase tracking-wide text-navy/60">Active</label>
                <input
                  type="checkbox"
                  checked={form.status === "active"}
                  onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })}
                  className="h-4 w-4 accent-pink"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditingId(null)} className="rounded-full border-2 border-navy px-5 py-2.5 text-sm font-bold text-navy">
                Cancel
              </button>
              <button onClick={save} className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
