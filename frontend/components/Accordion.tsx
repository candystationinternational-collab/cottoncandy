"use client";

import { useState } from "react";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border-2 border-navy/15">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display font-bold text-navy"
          >
            {item.q}
            <span className={`shrink-0 text-pink transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-navy/70">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}
