"use client";

import Link from "next/link";
import Image from "next/image";
import { CandyArt } from "@/lib/candyArt";
import { formatPrice } from "@/lib/CatalogProvider";
import { productEmoji } from "@/lib/emoji";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppOrderButton";
import type { Product } from "@/lib/apiClient";

export function ProductCard({ product }: { product: Product }) {
  const whatsappHref = buildWhatsAppOrderLink([{ name: product.name, variant: product.variants[0]?.name, quantity: 1 }]);

  return (
    <Link
      href={`/product/${product.id}`}
      data-gsap
      className="group relative block overflow-hidden rounded-[28px] border-2 border-navy/10 bg-white p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:border-pink"
    >
      <div className="absolute right-4 top-4 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-navy">
        ★ {product.rating}
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Order ${product.name} via WhatsApp`}
        className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-lime text-white transition-transform hover:scale-110"
      >
        <WhatsAppIcon />
      </a>
      <div className="relative mx-auto flex h-40 w-40 items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
        {product.images.length > 0 ? (
          <Image src={product.images[0]} alt={product.name} fill unoptimized className="object-contain drop-shadow-lg" />
        ) : (
          <CandyArt color={product.candyColor} id={`card-${product.id}`} className="h-full w-full" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-purple">{productEmoji(product.name)} {product.flavorTags[0]}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-navy">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl font-extrabold text-pink">{formatPrice(product.price)}</span>
          <span className="rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white transition-colors group-hover:bg-pink">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
