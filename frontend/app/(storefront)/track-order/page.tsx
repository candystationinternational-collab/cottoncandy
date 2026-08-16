"use client";

import { useState } from "react";
import { apiClient, type Order } from "@/lib/apiClient";
import { STATUS_STEPS, STATUS_LABELS } from "@/lib/orderStatus";
import { formatPrice } from "@/lib/CatalogProvider";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setOrder(await apiClient.trackOrder(orderNumber, email));
    } catch {
      setOrder(null);
    }
  }

  const currentIndex =
    order && order.status !== "cancelled" ? (STATUS_STEPS as readonly string[]).indexOf(order.status) : -1;

  return (
    <div className="container-cs py-12">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Track Order</p>
        <h1 className="font-display text-3xl font-extrabold text-navy">Where&apos;s My Cotton Candy?</h1>
        <p className="mt-2 text-navy/60">Enter your order number and the email used at checkout.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-4 sm:flex-row">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="ORD-2026-0001"
          className="flex-1 rounded-full border-2 border-navy/20 px-5 py-3 text-sm focus:border-pink focus:outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          type="email"
          className="flex-1 rounded-full border-2 border-navy/20 px-5 py-3 text-sm focus:border-pink focus:outline-none"
        />
        <button type="submit" className="rounded-full bg-pink px-8 py-3 text-sm font-bold uppercase tracking-wide text-white">
          Track
        </button>
      </form>

      {order === null && (
        <p className="mx-auto mt-8 max-w-xl rounded-2xl border-2 border-pink bg-pink/5 p-4 text-center text-sm text-pink">
          No order found with that order number and email combination.
        </p>
      )}

      {order && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border-2 border-navy p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-navy">{order.orderNumber}</h2>
            <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          {order.status !== "cancelled" && (
            <div className="mt-8 flex items-center justify-between">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      i <= currentIndex ? "border-lime bg-lime text-white" : "border-navy/20 text-navy/30"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`mt-2 text-[11px] font-semibold ${i <= currentIndex ? "text-navy" : "text-navy/30"}`}>
                    {STATUS_LABELS[s]}
                  </span>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`mt-[-28px] h-0.5 w-full translate-y-[-14px] ${i < currentIndex ? "bg-lime" : "bg-navy/10"}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 space-y-2 border-t-2 border-navy/10 pt-6 text-sm">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {item.productName} ({item.variantName}) × {item.quantity}
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t-2 border-navy/10 pt-4 font-display text-lg font-extrabold text-navy">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>

          {order.shippingAddress && (
            <div className="mt-4 text-sm text-navy/70">
              <p className="font-semibold text-navy">Delivery Address</p>
              <p>
                {order.shippingAddress.address1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
