"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/AuthProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Flavors" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/track-order", label: "Track Order" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();
  const { session } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-navy bg-bg/95 backdrop-blur">
      <nav className="container-cs flex h-28 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Candy Station" width={96} height={96} className="h-20 w-20 object-contain sm:h-24 sm:w-24" priority />
          <span className="hidden font-display text-xl font-bold text-pink sm:block">Candy Station</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors hover:text-pink ${
                  pathname === l.href ? "text-pink" : "text-navy"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            aria-label="View cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-navy text-navy transition-colors hover:border-pink hover:text-pink"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href={session ? "/account" : "/login"}
            className="hidden items-center gap-1.5 rounded-full border-2 border-navy px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-pink hover:text-pink sm:flex"
          >
            {session && <ProfileIcon />}
            {session ? session.name.split(" ")[0] : "Login"}
          </Link>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-navy text-navy md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span className={`h-0.5 w-5 bg-navy transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 bg-navy transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 bg-navy transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t-2 border-navy bg-cream md:hidden">
          <ul className="container-cs flex flex-col gap-4 py-5">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} onClick={() => setOpen(false)} className="text-base font-semibold text-navy">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={session ? "/account" : "/login"} onClick={() => setOpen(false)} className="text-base font-semibold text-pink">
                {session ? `My Account (${session.name.split(" ")[0]})` : "Login"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="21" r="1.5" fill="currentColor" />
      <circle cx="17" cy="21" r="1.5" fill="currentColor" />
    </svg>
  );
}
