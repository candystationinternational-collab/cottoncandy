"use client";

import Image from "next/image";
import { CandyArt } from "@/lib/candyArt";
import { formatPrice } from "@/lib/CatalogProvider";
import { useCart } from "@/lib/cartStore";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppOrderButton";
import type { Bundle } from "@/lib/apiClient";

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addBundle } = useCart();
  const savings = bundle.compareAtPrice ? bundle.compareAtPrice - bundle.price : 0;
  const whatsappHref = buildWhatsAppOrderLink([{ name: bundle.name, variant: "Bundle", quantity: 1 }]);

  return (
    <div data-gsap className="relative overflow-hidden rounded-[28px] border-2 border-navy bg-white p-6">
      {savings > 0 && (
        <span className="absolute right-4 top-4 rounded-full bg-lime px-3 py-1 text-xs font-bold text-white">
          Save {formatPrice(savings)}
        </span>
      )}

      <div className="flex h-28 items-center -space-x-8">
        {bundle.items.map((item) => (
          <div key={item.productId} className="relative h-24 w-24 shrink-0">
            {item.images.length > 0 ? (
              <Image src={item.images[0]} alt={item.productName} fill unoptimized sizes="96px" className="object-contain drop-shadow-md" />
            ) : (
              <CandyArt color={item.candyColor} id={`bundle-${bundle.id}-${item.productId}`} className="h-full w-full" />
            )}
          </div>
        ))}
      </div>

      <h3 className="mt-4 font-display text-xl font-bold text-navy">{bundle.name}</h3>
      <p className="mt-1 text-sm text-navy/70">{bundle.description}</p>

      <div className="mt-4 flex items-center gap-2">
        <span className="font-display text-2xl font-extrabold text-pink">{formatPrice(bundle.price)}</span>
        {bundle.compareAtPrice && (
          <span className="text-sm text-navy/40 line-through">{formatPrice(bundle.compareAtPrice)}</span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => addBundle(bundle.id, 1)}
          className="flex-1 rounded-full bg-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-pink active:scale-95"
        >
          Add Bundle to Cart
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Order ${bundle.name} via WhatsApp`}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-lime text-navy transition-colors hover:bg-lime hover:text-white"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </div>
  );
}
