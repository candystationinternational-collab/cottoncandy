"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";
import type { Order } from "@/lib/apiClient";

export default function PrintOrderPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const doc = searchParams.get("doc") === "invoice" ? "invoice" : "delivery-note";
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    adminApi.getOrder(Number(params.id)).then(setOrder);
  }, [params.id]);

  useEffect(() => {
    if (order) setTimeout(() => window.print(), 300);
  }, [order]);

  if (!order) return <p className="p-8 text-navy/50">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl bg-white p-10 text-navy print:p-0">
      <div className="mb-8 flex items-center justify-between border-b-2 border-navy pb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Candy Station</h1>
          <p className="text-sm text-navy/60">{doc === "invoice" ? "Invoice" : "Delivery Note"}</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-bold">{order.orderNumber}</p>
          <p className="text-navy/60">{new Date(order.placedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-navy/50">Deliver To</p>
          <p className="font-semibold">{order.customerName}</p>
          <p>{order.customerPhone}</p>
          {order.shippingAddress && (
            <p>
              {order.shippingAddress.address1} {order.shippingAddress.address2}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
          )}
          {!order.shippingAddress && <p>Store Pickup</p>}
        </div>
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-navy/50">Payment</p>
          <p>Cash on Delivery (COD)</p>
          <p className="mt-3 mb-1 text-xs font-bold uppercase tracking-wide text-navy/50">Status</p>
          <p className="capitalize">{order.status.replace(/_/g, " ")}</p>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-navy text-left">
            <th className="py-2">Item</th>
            <th className="py-2 text-center">Qty</th>
            {doc === "invoice" && <th className="py-2 text-right">Unit Price</th>}
            {doc === "invoice" && <th className="py-2 text-right">Total</th>}
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i} className="border-b border-navy/10">
              <td className="py-2">
                {item.productName} <span className="text-navy/50">({item.variantName})</span>
              </td>
              <td className="py-2 text-center">{item.quantity}</td>
              {doc === "invoice" && <td className="py-2 text-right">{formatPrice(item.unitPrice)}</td>}
              {doc === "invoice" && <td className="py-2 text-right">{formatPrice(item.lineTotal)}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {doc === "invoice" && (
        <div className="mt-6 ml-auto w-56 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-navy pt-1 font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-navy/40">Thank you for shopping with Candy Station!</p>

      <button
        onClick={() => window.print()}
        className="mx-auto mt-8 block rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-white print:hidden"
      >
        Print
      </button>
    </div>
  );
}
