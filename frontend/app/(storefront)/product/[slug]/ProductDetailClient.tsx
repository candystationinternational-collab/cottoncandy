"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { useCatalog, formatPrice, useRelatedProducts, useProductsByCategory } from "@/lib/CatalogProvider";
import { useCart } from "@/lib/cartStore";
import { productEmoji } from "@/lib/emoji";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FlavorCarousel } from "@/components/FlavorCarousel";
import { ProductCard } from "@/components/ProductCard";
import { QuantityStepper } from "@/components/QuantityStepper";
import { WhatsAppOrderButton } from "@/components/WhatsAppOrderButton";

type Tab = "description" | "ingredients" | "nutrition" | "reviews";

export function ProductDetailClient({ slug }: { slug: string }) {
  const { products, loading } = useCatalog();
  const product = products.find((p) => p.slug === slug);

  const { addProduct } = useCart();
  const [variantId, setVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");

  const flavorsInCategory = useProductsByCategory(product?.categoryId ?? -1);
  const relatedProducts = useRelatedProducts(product ?? products[0] ?? ({} as never));

  if (!loading && !product) notFound();
  if (!product) return null;

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <div className="container-cs py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <ProductShowcase color={product.candyColor} productId={product.id} images={product.images} />
          <FlavorCarousel flavors={flavorsInCategory} currentId={product.id} />
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">
            {productEmoji(product.name)} {product.flavorTags.join(" · ")}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-navy sm:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-navy/60">
            <span className="text-gold">★ {product.rating}</span>
            <span>({product.reviewCount} reviews)</span>
            <span>· SKU {product.sku}</span>
          </div>

          <p className="mt-5 max-w-lg text-navy/75">{product.description}</p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/60">Pack Size</p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-colors ${
                    v.id === variant.id ? "border-pink bg-pink text-white" : "border-navy/20 text-navy hover:border-navy"
                  }`}
                >
                  {v.name} — {formatPrice(v.price)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} />
            <button
              onClick={() => addProduct(product.id, variant.id, qty)}
              className="flex-1 rounded-full bg-navy px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-pink sm:flex-none"
            >
              Add to Cart — {formatPrice(variant.price * qty)}
            </button>
          </div>

          <div className="mt-4">
            <WhatsAppOrderButton itemName={product.name} variantName={variant.name} quantity={qty} className="inline-flex items-center gap-2 rounded-full border-2 border-lime px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy transition-colors hover:bg-lime hover:text-white" />
          </div>

          {/* Tabs */}
          <div className="mt-10 border-t-2 border-navy/10 pt-6">
            <div className="flex flex-wrap gap-2">
              {(["description", "ingredients", "nutrition", "reviews"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                    tab === t ? "bg-navy text-white" : "bg-cream text-navy/70 hover:text-navy"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5 text-sm text-navy/75">
              {tab === "description" && <p>{product.description}</p>}
              {tab === "ingredients" && <p>{product.ingredients}</p>}
              {tab === "nutrition" && (
                <table className="w-full max-w-sm text-left text-sm">
                  <tbody>
                    <tr className="border-b border-navy/10">
                      <td className="py-2 font-semibold">Serving Size</td>
                      <td className="py-2">{product.servingSize}</td>
                    </tr>
                    <tr className="border-b border-navy/10">
                      <td className="py-2 font-semibold">Calories</td>
                      <td className="py-2">{product.calories}</td>
                    </tr>
                    <tr className="border-b border-navy/10">
                      <td className="py-2 font-semibold">Fat</td>
                      <td className="py-2">{product.fat}</td>
                    </tr>
                    <tr className="border-b border-navy/10">
                      <td className="py-2 font-semibold">Carbs</td>
                      <td className="py-2">{product.carbs}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Protein</td>
                      <td className="py-2">{product.protein}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {tab === "reviews" && (
                <p>
                  {product.reviewCount} customers rated this flavor an average of {product.rating} / 5. Written
                  reviews aren&apos;t collected yet — coming soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-extrabold text-navy">You Might Also Like</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
