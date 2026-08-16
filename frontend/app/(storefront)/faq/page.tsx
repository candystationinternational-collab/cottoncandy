"use client";

import { Accordion } from "@/components/Accordion";
import { useCatalog, formatPrice } from "@/lib/CatalogProvider";

export default function FaqPage() {
  const { deliveryZones, settings } = useCatalog();

  const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
    {
      title: "Orders",
      items: [
        { q: "How do I place an order?", a: "Browse our flavors, add your favorites to the cart, and complete the 6-step checkout — no account required." },
        { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement — contact us right away." },
        { q: "Do I need an account to order?", a: "No — guest checkout is available for every order." },
      ],
    },
    {
      title: "Shipping & Delivery",
      items: [
        { q: "Where do you deliver?", a: "We currently deliver across the Kathmandu Valley and select zones beyond, listed below." },
        { q: "How long does delivery take?", a: "Most Kathmandu Valley orders arrive same-day when placed before 5 PM." },
        { q: "Can I pick up my order instead?", a: `Yes — free store pickup is available at ${settings?.pickupAddress ?? "our flagship store"}.` },
      ],
    },
    {
      title: "Payments",
      items: [
        { q: "What payment methods do you accept?", a: `Cash on Delivery (COD) only for now, up to ${formatPrice(settings?.codMaxOrder ?? 0)} per order. Online payments are coming soon.` },
        { q: "Is there a minimum order value?", a: "No minimum order value currently applies." },
      ],
    },
    {
      title: "Returns & Refunds",
      items: [
        { q: "Can I return opened cotton candy?", a: "No returns are accepted on opened cotton candy for hygiene reasons." },
        { q: "What if my order arrives damaged or incorrect?", a: "We'll replace it within 24 hours — just reach out with your order number." },
        { q: "How long do refunds take?", a: "Approved refunds are processed within 3–5 business days." },
      ],
    },
    {
      title: "Product Info",
      items: [
        { q: "What flavors do you offer?", a: "Strawberry Dream, Blueberry Bliss, Orange Burst, Mint Fresh, Coffee Delight, and Vanilla Bliss." },
        { q: "What sizes are available?", a: "Single Pack (50 g) and Family Pack (150 g) for every flavor." },
      ],
    },
  ];

  return (
    <div className="container-cs py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Support</p>
        <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">Frequently Asked Questions</h1>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-10">
        {FAQ_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="mb-4 font-display text-lg font-bold text-navy">{group.title}</h2>
            <Accordion items={group.items} />
          </div>
        ))}

        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-navy">Delivery Zones</h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-navy/15">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-navy/70">
                <tr>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Coverage</th>
                  <th className="px-4 py-3">Fee</th>
                </tr>
              </thead>
              <tbody>
                {deliveryZones.map((z) => (
                  <tr key={z.id} className="border-t border-navy/10">
                    <td className="px-4 py-3 font-semibold text-navy">{z.name}</td>
                    <td className="px-4 py-3 text-navy/70">{z.description}</td>
                    <td className="px-4 py-3 font-bold text-pink">{formatPrice(z.cost)}</td>
                  </tr>
                ))}
                <tr className="border-t border-navy/10">
                  <td className="px-4 py-3 font-semibold text-navy">Store Pickup</td>
                  <td className="px-4 py-3 text-navy/70">{settings?.pickupAddress}</td>
                  <td className="px-4 py-3 font-bold text-lime">Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-navy p-6 text-sm text-navy/75">
          <p className="font-display font-bold text-navy">Store Hours &amp; COD Instructions</p>
          <p className="mt-2">{settings?.storeHours}</p>
          <p className="mt-1">{settings?.codInstructions}</p>
        </div>
      </div>
    </div>
  );
}
