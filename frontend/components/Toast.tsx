"use client";

import { useEffect, useState } from "react";
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
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white shadow-lg">
        <span className="inline-block h-2 w-2 rounded-full bg-lime" />
        {message}
      </div>
    </div>
  );
}
