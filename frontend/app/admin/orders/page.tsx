"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, type AdminOrderListItem } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";
import { STATUS_LABELS, labelForStatus } from "@/lib/orderStatus";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  function load() {
    adminApi.getOrders({ status: status || undefined, search: search || undefined }).then(setOrders);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `search` is intentionally read only on explicit Filter click/Enter, not on every keystroke
  useEffect(load, [status]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-navy">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search order #, name, email…"
          className="w-64 rounded-full border-2 border-navy/20 px-4 py-2 text-sm focus:border-pink focus:outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm font-semibold text-navy focus:border-pink focus:outline-none"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <button onClick={load} className="rounded-full bg-navy px-5 py-2 text-sm font-bold text-white hover:bg-pink">
          Filter
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-navy/70">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Placed</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-navy/10">
                <td className="px-4 py-3 font-semibold text-navy">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-navy">{o.customerName}</p>
                  <p className="text-xs text-navy/50">{o.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-navy/70">{o.deliveryMethod}</td>
                <td className="px-4 py-3 font-bold text-pink">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">{labelForStatus(o.status)}</span>
                </td>
                <td className="px-4 py-3 text-navy/50">{new Date(o.placedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-xs font-bold text-pink">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-navy/50">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
