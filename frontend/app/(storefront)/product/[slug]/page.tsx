import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

type ProductSeo = {
  name: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  description: string | null;
  images: string[];
};

async function fetchProduct(slug: string): Promise<ProductSeo | null> {
  const res = await fetch(`${API_URL}/api/products/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return {};

  const title = product.metaTitle || `${product.name} — Candy Station`;
  const description = product.metaDescription || product.description || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();
  // Old numeric (or stale) URLs resolve here too — redirect to the canonical slug URL.
  if (product.slug !== slug) redirect(`/product/${product.slug}`);

  return <ProductDetailClient slug={slug} />;
}
