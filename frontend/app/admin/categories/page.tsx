"use client";

import { useEffect, useState } from "react";
import { adminApi, type CategoryWrite } from "@/lib/adminApi";
import type { Category } from "@/lib/apiClient";

const EMPTY: CategoryWrite = { name: "", description: "", displayOrder: 0, status: "active" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<CategoryWrite>(EMPTY);
  const [error, setError] = useState("");

  function load() {
    adminApi.getCategories().then(setCategories);
  }
  useEffect(load, []);

  function openNew() {
    setForm({ ...EMPTY, displayOrder: categories.length + 1 });
    setEditingId("new");
    setError("");
  }

  function openEdit(c: Category) {
    setForm({ name: c.name, description: c.description, displayOrder: c.displayOrder, status: "active" });
    setEditingId(c.id);
    setError("");
  }

  async function save() {
    setError("");
    try {
      if (editingId === "new") await adminApi.createCategory(form);
      else if (typeof editingId === "number") await adminApi.updateCategory(editingId, form);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this category? Categories with assigned products cannot be deleted.")) return;
    try {
      await adminApi.deleteCategory(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete category.");
    }
  }

  async function move(id: number, direction: -1 | 1) {
    const sorted = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    await Promise.all([
      adminApi.reorderCategory(sorted[idx].id, sorted[swapIdx].displayOrder),
      adminApi.reorderCategory(sorted[swapIdx].id, sorted[idx].displayOrder),
    ]);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-navy">Categories</h1>
        <button onClick={openNew} className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-pink">
          + Add Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...categories]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((c) => (
            <div key={c.id} className="rounded-2xl border-2 border-navy/10 bg-white p-5">
              <h3 className="font-display font-bold text-navy">{c.name}</h3>
              <p className="mt-1 text-sm text-navy/60">{c.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  <button onClick={() => move(c.id, -1)} className="rounded border border-navy/20 px-2 py-1 text-navy hover:border-navy">
                    ↑
                  </button>
                  <button onClick={() => move(c.id, 1)} className="rounded border border-navy/20 px-2 py-1 text-navy hover:border-navy">
                    ↓
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(c)} className="font-bold text-navy hover:text-pink">
                    Edit
                  </button>
                  <button onClick={() => remove(c.id)} className="font-bold text-pink">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">{editingId === "new" ? "Add Category" : "Edit Category"}</h2>
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
