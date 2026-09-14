"use client";

import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "@/lib/CatalogProvider";

export function Footer() {
  const { settings } = useCatalog();
  return (
    <footer className="bg-navy text-white">
      <div className="container-cs grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Image
            src="/logo.png"
            alt="Candy Station"
            width={64}
            height={64}
            className="mb-4 h-16 w-16 object-contain brightness-0 invert"
          />
          <p className="text-sm text-white/70">
            Spreading happiness, one sweet treat at a time — premium cotton candy crafted in Nepal.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/shop" className="hover:text-pink">Shop</Link></li>
            <li><Link href="/about" className="hover:text-pink">About Us</Link></li>
            <li><Link href="/faq" className="hover:text-pink">FAQ</Link></li>
            <li><Link href="/track-order" className="hover:text-pink">Track Order</Link></li>
            <li><Link href="/contact" className="hover:text-pink">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{settings?.storeAddress}</li>
            <li>{settings?.storePhone}</li>
            <li>{settings?.storeEmail}</li>
            <li>{settings?.storeHours}</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-gold">Stay Sweet</h4>
          <p className="mb-3 text-sm text-white/70">Get flavor drops and offers in your inbox.</p>
          <form className="flex overflow-hidden rounded-full border-2 border-white/20" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
            <button type="submit" className="bg-pink px-4 py-2 text-sm font-bold text-white">
              Join
            </button>
          </form>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-lime" />
            Cash on Delivery available
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-cs flex flex-col items-center gap-3 text-center text-xs text-white/50 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Candy Station. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/policies/privacy-policy" className="hover:text-pink">Privacy Policy</Link>
            <Link href="/policies/terms-of-service" className="hover:text-pink">Terms of Service</Link>
            <Link href="/policies/return-refund-policy" className="hover:text-pink">Return &amp; Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
