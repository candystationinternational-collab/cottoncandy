"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { useAuth } from "@/lib/AuthProvider";
import { useCatalog } from "@/lib/CatalogProvider";

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
  const { settings } = useCatalog();

  const socialLinks = [
    { href: settings?.facebookUrl, label: "Facebook", icon: <FacebookIcon /> },
    { href: settings?.instagramUrl, label: "Instagram", icon: <InstagramIcon /> },
    { href: settings?.tiktokUrl, label: "TikTok", icon: <TiktokIcon /> },
  ].filter((s) => s.href);

  return (
    <>
      {socialLinks.length > 0 && (
        <div className="border-b border-navy/10 bg-navy">
          <div className="container-cs flex h-8 items-center justify-end gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Candy Station on ${s.label}`}
                className="text-white/70 transition-colors hover:text-white"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      )}
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
    </>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 8.5h2.5V5h-2.5C12.5 5 11 6.6 11 9v2.5H8.5V15H11v6.5h3.5V15h2.6l.4-3.5h-3V9c0-.6.3-.5.5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 3.5c.6 2 2.1 3.4 4 3.6v3a7.2 7.2 0 0 1-4-1.2v5.9a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v3.1a2.3 2.3 0 1 0 1.7 2.2V3.5H16Z"
        fill="currentColor"
      />
    </svg>
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
