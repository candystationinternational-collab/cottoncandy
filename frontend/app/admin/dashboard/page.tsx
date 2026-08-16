"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, type Stats } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getStats()
      .then(setStats)
      .catch(() => setError("Could not load dashboard stats."));
  }, []);

  if (error) return <p className="text-pink">{error}</p>;
  if (!stats) return <p className="text-navy/50">Loading…</p>;

  const cards = [
    { label: "Revenue (Delivered)", value: formatPrice(stats.revenue), color: "bg-pink" },
    { label: "Orders", value: stats.ordersCount, color: "bg-purple" },
    { label: "Pending", value: stats.pendingCount, color: "bg-orange" },
    { label: "Products", value: stats.productsCount, color: "bg-cyan" },
    { label: "Low Stock", value: stats.lowStockCount, color: "bg-navy" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-navy">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border-2 border-navy/10 bg-white p-5">
            <span className={`mb-3 inline-flex h-2 w-8 rounded-full ${c.color}`} />
            <p className="font-display text-2xl font-extrabold text-navy">{c.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">Orders (last 7 days)</h2>
          {stats.ordersByDay.length === 0 ? (
            <p className="text-sm text-navy/50">No orders in this window.</p>
          ) : (
            <div className="space-y-2">
              {stats.ordersByDay.map((d) => (
                <div key={d.date} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-navy/60">{d.date}</span>
                  <div className="h-3 flex-1 rounded-full bg-cream">
                    <div
                      className="h-3 rounded-full bg-pink"
                      style={{ width: `${Math.min(100, d.count * 20)}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-bold text-navy">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">Top Products</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-navy/50">No sales yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.topProducts.map((p) => (
                <li key={p.name} className="flex justify-between">
                  <span className="text-navy">{p.name}</span>
                  <span className="font-bold text-pink">{p.unitsSold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-navy">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-pink">
              View all →
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-navy/50">No orders yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.recentOrders.map((o) => (
                <li key={o.orderNumber} className="flex justify-between">
                  <span className="text-navy">{o.orderNumber} · {o.customerName}</span>
                  <span className="font-bold text-navy">{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border-2 border-pink/30 bg-pink/5 p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">Low Stock Alerts</h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-navy/50">Everything is well stocked.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.lowStockProducts.map((p) => (
                <li key={p.name} className="flex justify-between">
                  <span className="text-navy">{p.name}</span>
                  <span className="font-bold text-pink">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
