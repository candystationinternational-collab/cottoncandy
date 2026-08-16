"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/lib/CatalogProvider";

export type CartLine =
  | { kind: "product"; productId: number; variantId: number; quantity: number }
  | { kind: "bundle"; bundleId: number; quantity: number };

function sameLine(a: CartLine, b: CartLine): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "product" && b.kind === "product") return a.productId === b.productId && a.variantId === b.variantId;
  if (a.kind === "bundle" && b.kind === "bundle") return a.bundleId === b.bundleId;
  return false;
}

type CartContextValue = {
  lines: CartLine[];
  addProduct: (productId: number, variantId: number, quantity: number) => void;
  addBundle: (bundleId: number, quantity: number) => void;
  removeLine: (line: CartLine) => void;
  updateQuantity: (line: CartLine, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  lastAdded: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cs_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { products, bundles } = useCatalog();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage post-mount to avoid SSR mismatch
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addProduct = useCallback(
    (productId: number, variantId: number, quantity: number) => {
      const line: CartLine = { kind: "product", productId, variantId, quantity };
      setLines((prev) => {
        const existing = prev.find((l) => sameLine(l, line));
        if (existing) return prev.map((l) => (sameLine(l, line) ? { ...l, quantity: l.quantity + quantity } : l));
        return [...prev, line];
      });
      const product = products.find((p) => p.id === productId);
      setLastAdded(product ? `${product.name} added to cart` : "Item added to cart");
    },
    [products]
  );

  const addBundle = useCallback(
    (bundleId: number, quantity: number) => {
      const line: CartLine = { kind: "bundle", bundleId, quantity };
      setLines((prev) => {
        const existing = prev.find((l) => sameLine(l, line));
        if (existing) return prev.map((l) => (sameLine(l, line) ? { ...l, quantity: l.quantity + quantity } : l));
        return [...prev, line];
      });
      const bundle = bundles.find((b) => b.id === bundleId);
      setLastAdded(bundle ? `${bundle.name} added to cart` : "Bundle added to cart");
    },
    [bundles]
  );

  const removeLine = useCallback((line: CartLine) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, line)));
  }, []);

  const updateQuantity = useCallback((line: CartLine, quantity: number) => {
    setLines((prev) => prev.map((l) => (sameLine(l, line) ? { ...l, quantity } : l)).filter((l) => l.quantity > 0));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const subtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      if (l.kind === "product") {
        const product = products.find((p) => p.id === l.productId);
        const variant = product?.variants.find((v) => v.id === l.variantId);
        return sum + (variant ? variant.price * l.quantity : 0);
      }
      const bundle = bundles.find((b) => b.id === l.bundleId);
      return sum + (bundle ? bundle.price * l.quantity : 0);
    }, 0);
  }, [lines, products, bundles]);

  const value: CartContextValue = { lines, addProduct, addBundle, removeLine, updateQuantity, clear, count, subtotal, lastAdded };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
