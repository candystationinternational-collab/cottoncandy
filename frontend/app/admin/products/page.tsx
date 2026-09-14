"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi, type ProductWrite } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";
import { CandyArt } from "@/lib/candyArt";
import type { Product, Category } from "@/lib/apiClient";

const EMPTY_FORM: ProductWrite = {
  categoryId: 0,
  name: "",
  slug: null,
  metaTitle: null,
  metaDescription: null,
  description: "",
  ingredients: "",
  servingSize: "50 g",
  calories: null,
  fat: "0 g",
  carbs: "45 g",
  protein: "0 g",
  price: 200,
  compareAtPrice: null,
  costPrice: null,
  stock: 50,
  sku: "",
  weight: "50 g / 150 g",
  flavorTags: [],
  images: [],
  candyColor: "#F90264",
  status: "active",
  variants: [
    { name: "Single Pack (50 g)", price: 200 },
    { name: "Family Pack (150 g)", price: 500 },
  ],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null | "new">(null);
  const [form, setForm] = useState<ProductWrite>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  function load() {
    Promise.all([adminApi.getProducts(), adminApi.getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
    });
  }

  useEffect(load, []);

  function openNew() {
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? 0 });
    setEditingId("new");
    setError("");
  }

  function openEdit(p: Product) {
    setForm({
      categoryId: p.categoryId,
      name: p.name,
      slug: p.slug,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      description: p.description,
      ingredients: p.ingredients,
      servingSize: p.servingSize,
      calories: p.calories,
      fat: p.fat,
      carbs: p.carbs,
      protein: p.protein,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      costPrice: null,
      stock: p.stock,
      sku: p.sku,
      weight: p.weight,
      flavorTags: p.flavorTags,
      images: p.images,
      candyColor: p.candyColor,
      status: "active",
      variants: p.variants.map((v) => ({ id: v.id, name: v.name, price: v.price })),
    });
    setEditingId(p.id);
    setError("");
  }

  async function save() {
    setError("");
    try {
      if (editingId === "new") await adminApi.createProduct(form);
      else if (typeof editingId === "number") await adminApi.updateProduct(editingId, form);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await adminApi.uploadProductImage(file);
      setForm((f) => ({ ...f, images: [...f.images, url] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload image.");
    } finally {
      setUploading(false);
    }
  }

  function addImageUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setUrlDraft("");
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function remove(id: number) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await adminApi.deleteProduct(id);
    load();
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-navy">Products</h1>
        <button onClick={openNew} className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-pink">
          + Add Product
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products…"
        className="mb-4 w-full max-w-sm rounded-full border-2 border-navy/20 px-4 py-2 text-sm focus:border-pink focus:outline-none"
      />

      <div className="overflow-x-auto rounded-2xl border-2 border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-navy/70">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-navy/10">
                <td className="flex items-center gap-3 px-4 py-3">
                  {p.images.length > 0 ? (
                    <Image src={p.images[0]} alt={p.name} width={32} height={32} unoptimized className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <CandyArt color={p.candyColor} id={`admin-${p.id}`} className="h-8 w-8" />
                  )}
                  <span className="font-semibold text-navy">{p.name}</span>
                </td>
                <td className="px-4 py-3 text-navy/70">{categories.find((c) => c.id === p.categoryId)?.name}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className={`px-4 py-3 font-bold ${p.stock <= 20 ? "text-pink" : "text-navy"}`}>{p.stock}</td>
                <td className="px-4 py-3 text-navy/50">{p.sku}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="mr-3 text-xs font-bold text-navy hover:text-pink">
                    Edit
                  </button>
                  <button onClick={() => remove(p.id)} className="text-xs font-bold text-pink">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">
              {editingId === "new" ? "Add Product" : "Edit Product"}
            </h2>
            {error && <p className="mb-4 rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <LabeledInput label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Candy Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.candyColor}
                    onChange={(e) => setForm({ ...form, candyColor: e.target.value })}
                    className="h-10 w-14 rounded-lg border-2 border-navy/20"
                  />
                  <CandyArt color={form.candyColor} id="preview" className="h-10 w-10" />
                </div>
              </div>
              <LabeledInput label="Base Price (Rs.)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} />
              <LabeledInput label="Stock" type="number" value={String(form.stock)} onChange={(v) => setForm({ ...form, stock: Number(v) })} />
              <LabeledInput
                label="Flavor Tags (comma-separated)"
                value={form.flavorTags.join(",")}
                onChange={(v) => setForm({ ...form, flavorTags: v.split(",").map((t) => t.trim()).filter(Boolean) })}
                full
              />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border-2 border-navy/10 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-navy/60">SEO</p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">URL Slug</label>
                  <div className="flex items-center gap-1 rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus-within:border-pink">
                    <span className="shrink-0 text-navy/40">/product/</span>
                    <input
                      value={form.slug ?? ""}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="leave blank to auto-generate from name"
                      className="min-w-0 flex-1 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">SEO Title (optional)</label>
                  <input
                    value={form.metaTitle ?? ""}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value || null })}
                    placeholder={`${form.name || "Product name"} — Candy Station`}
                    maxLength={70}
                    className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                  />
                  <p className="mt-1 text-right text-[10px] text-navy/40">{(form.metaTitle ?? "").length}/70</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">SEO Description (optional)</label>
                  <textarea
                    value={form.metaDescription ?? ""}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value || null })}
                    placeholder="Leave blank to use the product description"
                    rows={2}
                    maxLength={160}
                    className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
                  />
                  <p className="mt-1 text-right text-[10px] text-navy/40">{(form.metaDescription ?? "").length}/160</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-navy/60">Product Photos</label>
              {form.images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-navy/10">
                      <Image src={url} alt={`Photo ${i + 1}`} fill unoptimized className="object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        aria-label={`Remove photo ${i + 1}`}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy/80 text-xs text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-full border-2 border-navy px-4 py-2 text-xs font-bold text-navy hover:border-pink hover:text-pink">
                  {uploading ? "Uploading…" : "Upload Photo"}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
                <span className="text-xs text-navy/40">or</span>
                <input
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                  placeholder="Paste an image URL"
                  className="min-w-0 flex-1 rounded-full border-2 border-navy/20 px-4 py-2 text-xs focus:border-pink focus:outline-none"
                />
                <button onClick={addImageUrl} className="rounded-full bg-cream px-4 py-2 text-xs font-bold text-navy hover:bg-navy/10">
                  Add URL
                </button>
              </div>
              {form.images.length === 0 && <p className="mt-2 text-xs text-navy/40">No photos yet — the generated candy-color art will be used instead.</p>}
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wide text-navy/60">Variants</label>
                <button
                  onClick={() => setForm({ ...form, variants: [...form.variants, { name: "", price: 0 }] })}
                  className="text-xs font-bold text-pink"
                >
                  + Add Variant
                </button>
              </div>
              <div className="space-y-2">
                {form.variants.map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={v.name}
                      onChange={(e) => {
                        const next = [...form.variants];
                        next[i] = { ...next[i], name: e.target.value };
                        setForm({ ...form, variants: next });
                      }}
                      placeholder="Variant name"
                      className="flex-1 rounded-lg border-2 border-navy/20 px-3 py-2 text-sm focus:border-pink focus:outline-none"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...form.variants];
                        next[i] = { ...next[i], price: Number(e.target.value) };
                        setForm({ ...form, variants: next });
                      }}
                      placeholder="Price"
                      className="w-28 rounded-lg border-2 border-navy/20 px-3 py-2 text-sm focus:border-pink focus:outline-none"
                    />
                    <button
                      onClick={() => setForm({ ...form, variants: form.variants.filter((_, vi) => vi !== i) })}
                      className="text-navy/40 hover:text-pink"
                    >
                      ✕
                    </button>
                  </div>
                ))}
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

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
      />
    </div>
  );
}
