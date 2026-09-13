"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/lib/AdminAuthProvider";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", roles: ["Admin"] },
  { href: "/admin/products", label: "Products", roles: ["Admin"] },
  { href: "/admin/categories", label: "Categories", roles: ["Admin"] },
  { href: "/admin/bundles", label: "Bundles", roles: ["Admin"] },
  { href: "/admin/hero-slider", label: "Hero Slider", roles: ["Admin"] },
  { href: "/admin/orders", label: "Orders", roles: ["Admin", "Delivery"] },
  { href: "/admin/customers", label: "Customers", roles: ["Admin"] },
  { href: "/admin/staff", label: "Staff Users", roles: ["Admin"] },
  { href: "/admin/settings", label: "Settings", roles: ["Admin"] },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { session, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const isPrintPage = pathname?.includes("/print");
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  useEffect(() => {
    if (!loading && !session && !isLoginPage) router.replace("/admin/login");
  }, [loading, session, isLoginPage, router]);

  // Close the mobile drawer whenever the route changes — adjusting state during render
  // (rather than in an effect) per React's guidance for resetting state on prop change.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  if (isLoginPage) return <>{children}</>;
  if (loading || !session) return null;

  // Printable pages render standalone (no admin chrome) so they print cleanly.
  if (isPrintPage) return <>{children}</>;

  const links = ADMIN_LINKS.filter((l) => l.roles.includes(session.role));

  const sidebar = (
    <>
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <Image src="/logo.png" alt="Candy Station" width={36} height={36} className="h-9 w-9 object-contain" />
        <span className="font-display text-sm font-bold">Candy Station Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              pathname?.startsWith(l.href) ? "bg-pink text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-white/50">Signed in as</p>
        <p className="text-sm font-semibold">{session.displayName ?? session.username}</p>
        <p className="text-xs text-gold">{session.role}</p>
        <button onClick={logout} className="mt-3 text-xs font-bold text-pink hover:underline">
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-navy bg-navy px-4 py-3 text-white lg:hidden">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Candy Station" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display text-sm font-bold">Candy Station Admin</span>
        </div>
        <button
          aria-label="Toggle admin menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/30"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Backdrop for the mobile drawer */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
        />
      )}

      {/* Sidebar: static on desktop, off-canvas drawer on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col bg-navy text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : ""
        }`}
      >
        {sidebar}
      </aside>

      <main className="flex-1 overflow-x-auto p-4 sm:p-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
