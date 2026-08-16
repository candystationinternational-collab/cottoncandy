"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import { apiClient, type Order } from "@/lib/apiClient";
import { formatPrice } from "@/lib/CatalogProvider";
import { STATUS_LABELS } from "@/lib/orderStatus";

type Tab = "profile" | "orders" | "addresses";

export default function AccountPage() {
  const router = useRouter();
  const { session, loading, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    if (session) apiClient.getMyOrders().then(setOrders).catch(() => setOrders([]));
  }, [session]);

  if (loading || !session) return null;

  return (
    <div className="container-cs py-12">
      <h1 className="mb-8 font-display text-3xl font-extrabold text-navy">My Account</h1>

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 lg:flex-col">
          {(["profile", "orders", "addresses"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-left text-sm font-bold capitalize lg:rounded-xl ${
                tab === t ? "bg-navy text-white" : "text-navy/70 hover:bg-cream"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-full px-4 py-2 text-left text-sm font-bold text-pink lg:rounded-xl"
          >
            Logout
          </button>
        </nav>

        <div>
          {tab === "profile" && (
            <div className="rounded-2xl border-2 border-navy/10 p-6">
              <p className="text-sm text-navy/60">Name</p>
              <p className="font-display font-bold text-navy">{session.name}</p>
              <p className="mt-4 text-sm text-navy/60">Email</p>
              <p className="font-display font-bold text-navy">{session.email}</p>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="rounded-2xl border-2 border-dashed border-navy/20 p-8 text-center text-navy/60">
                  No orders yet.{" "}
                  <Link href="/shop" className="font-bold text-pink">
                    Start shopping
                  </Link>
                  .
                </p>
              ) : (
                orders.map((o) => (
                  <div key={o.orderNumber} className="flex items-center justify-between rounded-2xl border-2 border-navy/10 p-4">
                    <div>
                      <p className="font-display font-bold text-navy">{o.orderNumber}</p>
                      <p className="text-xs text-navy/60">{new Date(o.placedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">
                      {STATUS_LABELS[o.status]}
                    </span>
                    <span className="font-display font-bold text-pink">{formatPrice(o.total)}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "addresses" && (
            <p className="rounded-2xl border-2 border-dashed border-navy/20 p-8 text-center text-navy/60">
              Saved addresses will appear here once you complete an order.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
