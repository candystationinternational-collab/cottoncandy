"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!loading && !session && !isLoginPage) router.replace("/admin/login");
  }, [loading, session, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (loading || !session) return null;

  // Printable pages render standalone (no admin chrome) so they print cleanly.
  if (isPrintPage) return <>{children}</>;

  const links = ADMIN_LINKS.filter((l) => l.roles.includes(session.role));

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-64 shrink-0 flex-col bg-navy text-white">
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
      </aside>
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
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
