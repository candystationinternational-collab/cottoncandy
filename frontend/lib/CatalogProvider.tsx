"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  apiClient,
  type Bundle,
  type Category,
  type DeliveryZone,
  type HeroSlide,
  type Product,
  type Settings,
} from "@/lib/apiClient";

type CatalogState = {
  products: Product[];
  categories: Category[];
  bundles: Bundle[];
  deliveryZones: DeliveryZone[];
  settings: Settings | null;
  heroSlides: HeroSlide[];
  loading: boolean;
  error: string | null;
};

const CatalogContext = createContext<CatalogState | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CatalogState>({
    products: [],
    categories: [],
    bundles: [],
    deliveryZones: [],
    settings: null,
    heroSlides: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [products, categories, bundles, deliveryZones, settings, heroSlides] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getCategories(),
          apiClient.getBundles(),
          apiClient.getDeliveryZones(),
          apiClient.getSettings(),
          apiClient.getHeroSlides(),
        ]);
        if (!cancelled) {
          setState({ products, categories, bundles, deliveryZones, settings, heroSlides, loading: false, error: null });
        }
      } catch {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: "Could not reach the Candy Station API. Is the backend running?" }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}

export function useProduct(id: number): Product | undefined {
  const { products } = useCatalog();
  return products.find((p) => p.id === id);
}

export function useRelatedProducts(product: Product, limit = 4): Product[] {
  const { products } = useCatalog();
  return products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, limit);
}

export function useProductsByCategory(categoryId: number): Product[] {
  const { products } = useCatalog();
  return products.filter((p) => p.categoryId === categoryId);
}

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}
