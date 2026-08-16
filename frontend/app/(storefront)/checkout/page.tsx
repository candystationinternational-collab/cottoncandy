"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { useCatalog, formatPrice } from "@/lib/CatalogProvider";
import { apiClient, type Order, type ShippingAddress } from "@/lib/apiClient";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type AuthChoice = "guest" | "login" | "signup";
type DeliveryMethod = "delivery" | "pickup";

const STEP_LABELS: Record<Step, string> = {
  1: "Account",
  2: "Shipping",
  3: "Delivery",
  4: "Payment",
  5: "Review",
  6: "Confirmation",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const { products, bundles, deliveryZones, settings } = useCatalog();
  const [step, setStep] = useState<Step>(1);
  const [authChoice, setAuthChoice] = useState<AuthChoice>("guest");
  const [shipping, setShipping] = useState<ShippingAddress>({
    name: "",
    phone: "",
    address1: "",
    address2: "",
    city: "Kathmandu",
    state: "Bagmati",
    postalCode: "",
    country: "Nepal",
  });
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [zoneId, setZoneId] = useState<number | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const effectiveZoneId = zoneId ?? deliveryZones[0]?.id;
  const zone = deliveryZones.find((z) => z.id === effectiveZoneId);
  const shippingCost = deliveryMethod === "pickup" ? 0 : zone?.cost ?? 0;
  const total = subtotal + shippingCost;

  const cartItems = useMemo(
    () =>
      lines.map((line) => {
        if (line.kind === "product") {
          const product = products.find((p) => p.id === line.productId);
          const variant = product?.variants.find((v) => v.id === line.variantId);
          return { line, name: product?.name, variantName: variant?.name, unitPrice: variant?.price ?? 0 };
        }
        const bundle = bundles.find((b) => b.id === line.bundleId);
        return { line, name: bundle?.name, variantName: "Bundle", unitPrice: bundle?.price ?? 0 };
      }),
    [lines, products, bundles]
  );

  if (lines.length === 0 && step !== 6) {
    return (
      <div className="container-cs py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold text-navy">Your cart is empty</h1>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-pink px-8 py-3 text-sm font-bold uppercase tracking-wide text-white">
          Shop Flavors
        </Link>
      </div>
    );
  }

  function validateStep(s: Step): string[] {
    const errs: string[] = [];
    if (s === 1 && authChoice !== "login") {
      if (!email.trim()) errs.push("Email is required.");
    }
    if (s === 2) {
      if (!shipping.name.trim()) errs.push("Full name is required.");
      if (!shipping.phone.trim()) errs.push("Phone number is required.");
      if (!shipping.address1.trim()) errs.push("Address line 1 is required.");
      if (!shipping.city.trim()) errs.push("City is required.");
      if (!shipping.postalCode.trim()) errs.push("Postal code is required.");
    }
    if (s === 3 && deliveryMethod === "delivery" && !effectiveZoneId) {
      errs.push("Please choose a delivery zone.");
    }
    return errs;
  }

  async function next() {
    const errs = validateStep(step);
    setErrors(errs);
    if (errs.length) return;

    if (step === 5) {
      setSubmitting(true);
      try {
        const created = await apiClient.createOrder({
          items: lines.map((l) =>
            l.kind === "product"
              ? { kind: "product" as const, productId: l.productId, variantId: l.variantId, quantity: l.quantity }
              : { kind: "bundle" as const, bundleId: l.bundleId, quantity: l.quantity }
          ),
          customerName: shipping.name,
          customerEmail: email,
          customerPhone: shipping.phone,
          deliveryMethod,
          deliveryZoneId: deliveryMethod === "delivery" ? (effectiveZoneId ?? undefined) : undefined,
          shippingAddress: shipping,
        });
        setOrder(created);
        clear();
        setStep(6);
      } catch {
        setErrors(["Could not place your order. Please check your details and try again."]);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => Math.min(6, s + 1) as Step);
  }

  function back() {
    setErrors([]);
    setStep((s) => Math.max(1, s - 1) as Step);
  }

  return (
    <div className="container-cs py-12">
      <h1 className="mb-2 font-display text-3xl font-extrabold text-navy">Checkout</h1>

      {/* Step indicator */}
      <div className="mb-10 flex flex-wrap gap-2">
        {([1, 2, 3, 4, 5, 6] as Step[]).map((s) => (
          <div
            key={s}
            className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold ${
              s === step ? "border-pink bg-pink text-white" : s < step ? "border-lime text-navy" : "border-navy/15 text-navy/40"
            }`}
          >
            <span>{s}</span>
            <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="mb-6 rounded-2xl border-2 border-pink bg-pink/5 p-4 text-sm text-pink">
          <ul className="list-inside list-disc">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">How would you like to checkout?</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["guest", "login", "signup"] as AuthChoice[]).map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setAuthChoice(choice)}
                    className={`rounded-2xl border-2 p-5 text-left transition-colors ${
                      authChoice === choice ? "border-pink bg-cream" : "border-navy/15 hover:border-navy"
                    }`}
                  >
                    <p className="font-display font-bold capitalize text-navy">{choice}</p>
                    <p className="mt-1 text-xs text-navy/60">
                      {choice === "guest" && "Checkout without an account"}
                      {choice === "login" && "Use your existing account"}
                      {choice === "signup" && "Create an account for faster checkout next time"}
                    </p>
                  </button>
                ))}
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">Shipping Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" value={shipping.name} onChange={(v) => setShipping({ ...shipping, name: v })} />
                <Field label="Phone" value={shipping.phone} onChange={(v) => setShipping({ ...shipping, phone: v })} placeholder="+977 98XXXXXXXX" />
                <Field label="Address Line 1" value={shipping.address1} onChange={(v) => setShipping({ ...shipping, address1: v })} full />
                <Field label="Address Line 2 (optional)" value={shipping.address2 ?? ""} onChange={(v) => setShipping({ ...shipping, address2: v })} full />
                <Field label="City" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} />
                <Field label="State / Province" value={shipping.state} onChange={(v) => setShipping({ ...shipping, state: v })} />
                <Field label="Postal Code" value={shipping.postalCode} onChange={(v) => setShipping({ ...shipping, postalCode: v })} />
                <Field label="Country" value={shipping.country} onChange={(v) => setShipping({ ...shipping, country: v })} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">Delivery Method</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`rounded-2xl border-2 p-5 text-left ${
                    deliveryMethod === "delivery" ? "border-pink bg-cream" : "border-navy/15"
                  }`}
                >
                  <p className="font-display font-bold text-navy">Home Delivery</p>
                  <p className="mt-1 text-xs text-navy/60">Zone-based delivery fee</p>
                </button>
                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`rounded-2xl border-2 p-5 text-left ${
                    deliveryMethod === "pickup" ? "border-pink bg-cream" : "border-navy/15"
                  }`}
                >
                  <p className="font-display font-bold text-navy">Store Pickup — Free</p>
                  <p className="mt-1 text-xs text-navy/60">{settings?.pickupAddress}</p>
                </button>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="space-y-2">
                  {deliveryZones.map((z) => (
                    <label
                      key={z.id}
                      className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-sm ${
                        effectiveZoneId === z.id ? "border-pink bg-cream" : "border-navy/15"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input type="radio" checked={effectiveZoneId === z.id} onChange={() => setZoneId(z.id)} className="accent-pink" />
                        <span>
                          <span className="font-semibold text-navy">{z.name}</span>{" "}
                          <span className="text-navy/60">— {z.description}</span>
                        </span>
                      </span>
                      <span className="font-bold text-pink">{formatPrice(z.cost)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">Payment</h2>
              <div className="rounded-2xl border-2 border-lime bg-lime/10 p-5">
                <p className="font-display font-bold text-navy">Cash on Delivery (COD)</p>
                <p className="mt-2 text-sm text-navy/70">{settings?.codInstructions}</p>
                <p className="mt-2 text-xs text-navy/50">
                  Min order: {formatPrice(settings?.codMinOrder ?? 0)} · Max order: {formatPrice(settings?.codMaxOrder ?? 0)}
                </p>
              </div>
              <p className="text-xs text-navy/50">Online payments (cards, wallets) coming soon.</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold text-navy">Review Your Order</h2>
              <div className="space-y-2 rounded-2xl border-2 border-navy/10 p-4 text-sm">
                {cartItems.map(({ line, name, variantName, unitPrice }, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {name} ({variantName}) × {line.quantity}
                    </span>
                    <span>{formatPrice(unitPrice * line.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border-2 border-navy/10 p-4 text-sm">
                <p className="font-semibold text-navy">Ship to</p>
                <p className="text-navy/70">
                  {shipping.name}, {shipping.address1} {shipping.address2}, {shipping.city}, {shipping.state}{" "}
                  {shipping.postalCode}, {shipping.country}
                </p>
                <p className="text-navy/70">{shipping.phone} · {email}</p>
              </div>
            </div>
          )}

          {step === 6 && order && (
            <div className="rounded-2xl border-2 border-lime bg-lime/10 p-8 text-center">
              <p className="text-5xl">🎉</p>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">Order Confirmed!</h2>
              <p className="mt-2 text-navy/70">
                Your order number is <span className="font-bold text-pink">{order.orderNumber}</span>
              </p>
              <p className="mt-1 text-sm text-navy/60">A confirmation has been noted against {order.customerEmail}.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href={`/track-order`} className="rounded-full bg-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-white">
                  Track Order
                </Link>
                <button
                  onClick={() => router.push("/shop")}
                  className="rounded-full border-2 border-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

          {step < 6 && (
            <div className="mt-8 flex justify-between">
              <button
                onClick={back}
                disabled={step === 1}
                className="rounded-full border-2 border-navy px-6 py-3 text-sm font-bold text-navy disabled:opacity-30"
              >
                Back
              </button>
              <button
                onClick={next}
                disabled={submitting}
                className="rounded-full bg-pink px-8 py-3 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-50"
              >
                {submitting ? "Placing Order…" : step === 5 ? "Place Order" : "Continue"}
              </button>
            </div>
          )}
        </div>

        {step < 6 && (
          <aside className="h-fit rounded-2xl border-2 border-navy p-6">
            <h2 className="font-display text-lg font-bold text-navy">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-navy/75">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t-2 border-navy/10 pt-4 font-display text-lg font-extrabold text-navy">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
      />
    </div>
  );
}
