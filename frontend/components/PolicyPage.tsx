"use client";

import Link from "next/link";
import { useCatalog } from "@/lib/CatalogProvider";

const POLICY_LINKS = [
  { href: "/policies/privacy-policy", label: "Privacy Policy" },
  { href: "/policies/terms-of-service", label: "Terms of Service" },
  { href: "/policies/return-refund-policy", label: "Return & Refund Policy" },
];

export function PolicyPage({ title, content }: { title: string; content: string | null | undefined }) {
  const { loading } = useCatalog();

  return (
    <div className="container-cs py-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Legal</p>
        <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">{title}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {POLICY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border-2 border-navy/15 px-4 py-1.5 text-xs font-bold text-navy/70 transition-colors hover:border-navy hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 whitespace-pre-line rounded-2xl border-2 border-navy/10 bg-white p-6 text-sm leading-relaxed text-navy/80 sm:p-8">
          {content ? content : loading ? "Loading…" : "This policy hasn't been added yet — please check back soon."}
        </div>
      </div>
    </div>
  );
}
