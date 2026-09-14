"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cartStore";
import { useCatalog, formatPrice, meetsSingleItemMinimum } from "@/lib/CatalogProvider";
import { CandyArt } from "@/lib/candyArt";
import { QuantityStepper } from "@/components/QuantityStepper";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart();
  const { products, bundles, settings } = useCatalog();

  const hasBundle = lines.some((l) => l.kind === "bundle");
  const minOrder = settings?.codMinOrder ?? 0;
  const meetsMinimum = meetsSingleItemMinimum(subtotal, hasBundle, minOrder);

  if (lines.length === 0) {
    return (
      <div className="container-cs flex flex-col items-center py-24 text-center">
        <div className="h-40 w-40">
          <CandyArt color="#F90264" id="empty-cart" className="h-full w-full opacity-60" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-navy">Your cart is empty</h1>
        <p className="mt-2 text-navy/60">Add a few flavors to get started.</p>
        <Link href="/shop" className="mt-6 rounded-full bg-pink px-8 py-3 text-sm font-bold uppercase tracking-wide text-white">
          Shop Flavors
        </Link>
      </div>
    );
  }

  return (
    <div className="container-cs py-12">
      <h1 className="mb-8 font-display text-3xl font-extrabold text-navy">Your Cart</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {lines.map((line, i) => {
            if (line.kind === "product") {
              const product = products.find((p) => p.id === line.productId);
              if (!product) return null;
              const variant = product.variants.find((v) => v.id === line.variantId);
              if (!variant) return null;
              const lineTotal = variant.price * line.quantity;

              return (
                <div key={i} className="flex flex-col gap-4 rounded-2xl border-2 border-navy/10 p-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0">
                      {product.images.length > 0 ? (
                        <Image src={product.images[0]} alt={product.name} fill unoptimized sizes="80px" className="object-contain" />
                      ) : (
                        <CandyArt color={product.candyColor} id={`cart-${product.id}`} className="h-full w-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/product/${product.slug}`} className="font-display font-bold text-navy hover:text-pink">
                        {product.name}
                      </Link>
                      <p className="text-sm text-navy/60">{variant.name}</p>
                      <p className="mt-1 text-sm font-semibold text-navy">{formatPrice(variant.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line, q)} />
                    <div className="text-right font-display font-bold text-pink sm:w-24">{formatPrice(lineTotal)}</div>
                    <button aria-label={`Remove ${product.name}`} onClick={() => removeLine(line)} className="text-navy/40 hover:text-pink">
                      ✕
                    </button>
                  </div>
                </div>
              );
            }

            const bundle = bundles.find((b) => b.id === line.bundleId);
            if (!bundle) return null;
            const lineTotal = bundle.price * line.quantity;

            return (
              <div key={i} className="flex flex-col gap-4 rounded-2xl border-2 border-navy/10 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center -space-x-6">
                    {bundle.items.slice(0, 3).map((it) => (
                      <div key={it.productId} className="relative h-10 w-10">
                        {it.images.length > 0 ? (
                          <Image src={it.images[0]} alt={it.productName} fill unoptimized sizes="40px" className="object-contain" />
                        ) : (
                          <CandyArt color={it.candyColor} id={`cart-bundle-${bundle.id}-${it.productId}`} className="h-full w-full" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-navy">{bundle.name}</p>
                    <p className="text-sm text-navy/60">Bundle · {bundle.items.length} flavors</p>
                    <p className="mt-1 text-sm font-semibold text-navy">{formatPrice(bundle.price)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line, q)} />
                  <div className="text-right font-display font-bold text-pink sm:w-24">{formatPrice(lineTotal)}</div>
                  <button aria-label={`Remove ${bundle.name}`} onClick={() => removeLine(line)} className="text-navy/40 hover:text-pink">
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border-2 border-navy p-6">
          <h2 className="font-display text-lg font-bold text-navy">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-navy/75">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-navy/50">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t-2 border-navy/10 pt-4 font-display text-lg font-extrabold text-navy">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {!meetsMinimum && (
            <p className="mt-4 rounded-xl border-2 border-pink bg-pink/5 p-3 text-xs text-pink">
              Orders of single flavors need a minimum of {formatPrice(minOrder)} to check out. Add another item, or
              choose a bundle instead.
            </p>
          )}
          <Link
            href={meetsMinimum ? "/checkout" : "#"}
            aria-disabled={!meetsMinimum}
            onClick={(e) => !meetsMinimum && e.preventDefault()}
            className={`mt-6 block rounded-full py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors ${
              meetsMinimum ? "bg-navy hover:bg-pink" : "cursor-not-allowed bg-navy/30"
            }`}
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
