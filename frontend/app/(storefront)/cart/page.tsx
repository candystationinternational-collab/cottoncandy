"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartStore";
import { useCatalog, formatPrice } from "@/lib/CatalogProvider";
import { CandyArt } from "@/lib/candyArt";
import { QuantityStepper } from "@/components/QuantityStepper";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart();
  const { products, bundles } = useCatalog();

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
                <div key={i} className="flex items-center gap-4 rounded-2xl border-2 border-navy/10 p-4">
                  <div className="h-20 w-20 shrink-0">
                    <CandyArt color={product.candyColor} id={`cart-${product.id}`} className="h-full w-full" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${product.id}`} className="font-display font-bold text-navy hover:text-pink">
                      {product.name}
                    </Link>
                    <p className="text-sm text-navy/60">{variant.name}</p>
                    <p className="mt-1 text-sm font-semibold text-navy">{formatPrice(variant.price)}</p>
                  </div>
                  <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line, q)} />
                  <div className="w-24 text-right font-display font-bold text-pink">{formatPrice(lineTotal)}</div>
                  <button aria-label={`Remove ${product.name}`} onClick={() => removeLine(line)} className="text-navy/40 hover:text-pink">
                    ✕
                  </button>
                </div>
              );
            }

            const bundle = bundles.find((b) => b.id === line.bundleId);
            if (!bundle) return null;
            const lineTotal = bundle.price * line.quantity;

            return (
              <div key={i} className="flex items-center gap-4 rounded-2xl border-2 border-navy/10 p-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center -space-x-6">
                  {bundle.items.slice(0, 3).map((it) => (
                    <CandyArt key={it.productId} color={it.candyColor} id={`cart-bundle-${bundle.id}-${it.productId}`} className="h-10 w-10" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-navy">{bundle.name}</p>
                  <p className="text-sm text-navy/60">Bundle · {bundle.items.length} flavors</p>
                  <p className="mt-1 text-sm font-semibold text-navy">{formatPrice(bundle.price)}</p>
                </div>
                <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line, q)} />
                <div className="w-24 text-right font-display font-bold text-pink">{formatPrice(lineTotal)}</div>
                <button aria-label={`Remove ${bundle.name}`} onClick={() => removeLine(line)} className="text-navy/40 hover:text-pink">
                  ✕
                </button>
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
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-navy py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-pink"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
