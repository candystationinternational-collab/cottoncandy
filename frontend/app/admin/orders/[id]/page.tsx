"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";
import { labelForStatus } from "@/lib/orderStatus";
import { useAdminAuth } from "@/lib/AdminAuthProvider";
import type { Order } from "@/lib/apiClient";

const NEXT_STATUS: Record<string, string | null> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
  delivered: null,
  cancelled: null,
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { session } = useAdminAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  function load() {
    adminApi.getOrder(id).then(setOrder).catch(() => setError("Order not found."));
  }
  useEffect(load, [id]);

  async function updateStatus(status: string) {
    setUpdating(true);
    setError("");
    try {
      await adminApi.updateOrderStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setUpdating(false);
    }
  }

  if (error && !order) return <p className="text-pink">{error}</p>;
  if (!order) return <p className="text-navy/50">Loading…</p>;

  const nextStatus = order.status !== "cancelled" ? NEXT_STATUS[order.status] : null;

  return (
    <div>
      <button onClick={() => router.push("/admin/orders")} className="mb-4 text-sm font-bold text-navy hover:text-pink">
        ← Back to Orders
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-navy">{order.orderNumber}</h1>
        <span className="rounded-full bg-navy px-4 py-1.5 text-sm font-bold text-white">{labelForStatus(order.status)}</span>
      </div>

      {error && <p className="mt-4 rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-navy">Items</h2>
            <div className="space-y-2 text-sm">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.productName} ({item.variantName}) × {item.quantity}
                  </span>
                  <span className="font-semibold text-navy">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t-2 border-navy/10 pt-4 text-sm">
              <div className="flex justify-between text-navy/70">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy/70">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-display text-lg font-extrabold text-navy">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-navy">Customer &amp; Delivery</h2>
            <p className="text-sm text-navy">{order.customerName}</p>
            <p className="text-sm text-navy/60">{order.customerEmail} · {order.customerPhone}</p>
            {order.shippingAddress && (
              <p className="mt-2 text-sm text-navy/70">
                {order.shippingAddress.address1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
            )}
            <p className="mt-2 text-xs text-navy/50">
              {order.deliveryMethod === "pickup" ? "Store Pickup" : "Home Delivery"} · Placed{" "}
              {new Date(order.placedAt).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-navy">Timeline</h2>
            <ul className="space-y-2 text-sm">
              {order.timeline.map((t, i) => (
                <li key={i} className="flex justify-between text-navy/70">
                  <span>{labelForStatus(t.status)}</span>
                  <span>{new Date(t.changedAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border-2 border-navy p-6">
          <h2 className="font-display text-lg font-bold text-navy">Actions</h2>

          {order.status !== "cancelled" && order.status !== "delivered" && nextStatus && (
            <button
              onClick={() => updateStatus(nextStatus)}
              disabled={updating}
              className="w-full rounded-full bg-pink py-3 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-50"
            >
              Mark as {labelForStatus(nextStatus)}
            </button>
          )}

          {session?.role === "Admin" && order.status !== "cancelled" && order.status !== "delivered" && (
            <button
              onClick={() => updateStatus("cancelled")}
              disabled={updating}
              className="w-full rounded-full border-2 border-pink py-3 text-sm font-bold uppercase tracking-wide text-pink disabled:opacity-50"
            >
              Cancel Order
            </button>
          )}

          <div className="border-t-2 border-navy/10 pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/50">Print</p>
            <div className="flex flex-col gap-2">
              <Link
                href={`/admin/orders/${id}/print?doc=delivery-note`}
                target="_blank"
                className="rounded-full border-2 border-navy px-4 py-2.5 text-center text-xs font-bold text-navy hover:border-pink hover:text-pink"
              >
                Print Delivery Note
              </Link>
              <Link
                href={`/admin/orders/${id}/print?doc=invoice`}
                target="_blank"
                className="rounded-full border-2 border-navy px-4 py-2.5 text-center text-xs font-bold text-navy hover:border-pink hover:text-pink"
              >
                Print Invoice
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
