import Link from "next/link";
import type { Category } from "@/lib/apiClient";

const ACCENTS: Record<number, string> = {
  1: "bg-pink",
  2: "bg-orange",
  3: "bg-cyan",
  4: "bg-purple",
};

export function CategoryCard({ category }: { category: Category }) {
  const accent = ACCENTS[category.id] ?? "bg-pink";
  return (
    <Link
      href={`/shop?cat=${category.id}`}
      data-gsap
      className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-[28px] border-2 border-navy p-6 transition-transform hover:-translate-y-1.5"
      style={{ backgroundColor: "var(--cs-cream)" }}
    >
      <span className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${accent} opacity-90`} />
      <h3 className="relative font-display text-xl font-extrabold text-navy">{category.name}</h3>
      <p className="relative mt-1 text-sm text-navy/70">{category.description}</p>
    </Link>
  );
}
