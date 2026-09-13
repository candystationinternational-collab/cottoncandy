"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartStore";

export function ToastHost() {
  const { lastAdded } = useCart();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!lastAdded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to an external cart event, not derivable during render
    setMessage(lastAdded);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3800);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 top-24 z-[200] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 transition-all duration-300 sm:top-28 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-3 scale-95 opacity-0"
      }`}
    >
      <div className="flex items-center gap-4 rounded-2xl border-2 border-navy bg-pink px-5 py-4 text-white shadow-2xl">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-pink">
          <CheckIcon />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-white/80">Added to cart</p>
          <p className="truncate font-display text-base font-bold">{message}</p>
        </div>
        <Link
          href="/cart"
          className="shrink-0 rounded-full bg-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-navy"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
