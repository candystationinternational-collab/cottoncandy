"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi, type BundleWrite } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";
import { CandyArt } from "@/lib/candyArt";
import type { Bundle, Product } from "@/lib/apiClient";

const EMPTY: BundleWrite = { name: "", description: "", price: 0, compareAtPrice: null, status: "active", items: [] };

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<BundleWrite>(EMPTY);
  const [error, setError] = useState("");

  function load() {
    Promise.all([adminApi.getBundles(), adminApi.getProducts()]).then(([b, p]) => {
      setBundles(b);
      setProducts(p);
    });
  }
  useEffect(load, []);

  function openNew() {
    setForm(EMPTY);
    setEditingId("new");
    setError("");
  }

  function openEdit(b: Bundle) {
    setForm({
      name: b.name,
      description: b.description,
      price: b.price,
      compareAtPrice: b.compareAtPrice,
      status: "active",
      items: b.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    setEditingId(b.id);
    setError("");
  }

  async function save() {
    setError("");
    if (form.items.length === 0) {
      setError("Add at least one product to the bundle.");
      return;
    }
    try {
      if (editingId === "new") await adminApi.createBundle(form);
      else if (typeof editingId === "number") await adminApi.updateBundle(editingId, form);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save bundle.");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this bundle?")) return;
    await adminApi.deleteBundle(id);
    load();
  }

  function toggleProduct(productId: number) {
    const exists = form.items.find((i) => i.productId === productId);
    if (exists) setForm({ ...form, items: form.items.filter((i) => i.productId !== productId) });
    else setForm({ ...form, items: [...form.items, { productId, quantity: 1 }] });
  }

  function setQuantity(productId: number, quantity: number) {
    setForm({ ...form, items: form.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)) });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-navy">Bundles</h1>
        <button onClick={openNew} className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-pink">
          + Add Bundle
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.map((b) => (
          <div key={b.id} className="rounded-2xl border-2 border-navy/10 bg-white p-5">
            <div className="flex h-14 items-center -space-x-4">
              {b.items.map((it) => (
                <div key={it.productId} className="relative h-10 w-10">
                  {it.images.length > 0 ? (
                    <Image src={it.images[0]} alt={it.productName} fill unoptimized sizes="40px" className="object-contain" />
                  ) : (
                    <CandyArt color={it.candyColor} id={`admin-bundle-${b.id}-${it.productId}`} className="h-full w-full" />
                  )}
                </div>
              ))}
            </div>
            <h3 className="mt-3 font-display font-bold text-navy">{b.name}</h3>
            <p className="mt-1 text-sm text-navy/60">{b.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-display text-lg font-extrabold text-pink">{formatPrice(b.price)}</span>
              {b.compareAtPrice && <span className="text-xs text-navy/40 line-through">{formatPrice(b.compareAtPrice)}</span>}
            </div>
            <div className="mt-4 flex justify-end gap-3 text-xs">
              <button onClick={() => openEdit(b)} className="font-bold text-navy hover:text-pink">
                Edit
              </button>
              <button onClick={() => remove(b.id)} className="font-bold text-pink">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">{editingId === "new" ? "Add Bundle" : "Edit Bundle"}</h2>
            {error && <p className="mb-4 rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Bundle Price (Rs.)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Compare-at Price</label>
                  <input
                    type="number"
                    value={form.compareAtPrice ?? ""}
                    onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-navy/60">Flavors in this bundle</label>
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border-2 border-navy/10 p-3">
                  {products.map((p) => {
                    const item = form.items.find((i) => i.productId === p.id);
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <input type="checkbox" checked={!!item} onChange={() => toggleProduct(p.id)} className="h-4 w-4 accent-pink" />
                        {p.images.length > 0 ? (
                          <div className="relative h-8 w-8 shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill unoptimized sizes="32px" className="object-contain" />
                          </div>
                        ) : (
                          <CandyArt color={p.candyColor} id={`bundle-picker-${p.id}`} className="h-8 w-8" />
                        )}
                        <span className="flex-1 text-sm text-navy">{p.name}</span>
                        {item && (
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => setQuantity(p.id, Number(e.target.value))}
                            className="w-16 rounded-lg border-2 border-navy/20 px-2 py-1 text-sm"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
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
