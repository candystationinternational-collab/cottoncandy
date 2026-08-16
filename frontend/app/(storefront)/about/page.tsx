"use client";

import Link from "next/link";
import { CandyArt } from "@/lib/candyArt";
import { useCatalog } from "@/lib/CatalogProvider";

const VALUES = [
  { title: "Quality First", desc: "Every batch is crafted with care and premium ingredients.", color: "bg-pink" },
  { title: "Creativity", desc: "Fun packaging meets a modern, timeless experience.", color: "bg-purple" },
  { title: "Joy in Every Bite", desc: "We make sweets that turn into memories.", color: "bg-orange" },
  { title: "Consistency", desc: "The same fluffy, flavorful treat, every single order.", color: "bg-cyan" },
];

export default function AboutPage() {
  const { products, settings } = useCatalog();
  return (
    <div>
      <section className="border-b-4 border-navy bg-cream py-16">
        <div className="container-cs grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Our Story</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold text-navy">Welcome to Candy Station!</h1>
            <p className="mt-5 text-navy/75">
              Candy Station was created with one goal: to bring joy, excitement, and unforgettable moments through
              premium confectionery. We believe that sweets are more than just treats — they are memories shared
              with friends and family, celebrations, and little moments of happiness.
            </p>
            <p className="mt-4 text-navy/75">
              Our products are crafted with care, creativity, and attention to quality, combining fun packaging
              with a modern and timeless experience. Every Candy Station product is designed to spread smiles and
              create sweet memories for people of all ages.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="flex h-24 items-center justify-center rounded-2xl bg-white">
                <CandyArt color={p.candyColor} id={`about-grid-${p.id}`} className="h-16 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-cs py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-navy">Our Mission</h2>
          <p className="mt-4 text-navy/70">
            As we continue to grow, our mission remains the same: to deliver happiness, creativity, and a touch of
            magic in every product we create. At Candy Station, we&apos;re spreading happiness, one sweet treat at a
            time.
          </p>
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="container-cs">
          <h2 className="mb-8 text-center font-display text-2xl font-extrabold">Why Choose Us</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white/5 p-6">
                <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${v.color} text-white`}>
                  ✓
                </span>
                <h3 className="font-display font-bold">{v.title}</h3>
                <p className="mt-1 text-sm text-white/70">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-cs py-16 text-center">
        <h2 className="font-display text-2xl font-extrabold text-navy">Get In Touch</h2>
        <p className="mt-2 text-navy/70">{settings?.storeAddress} · {settings?.storePhone} · {settings?.storeEmail}</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-pink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white">
          Shop Our Flavors
        </Link>
      </section>
    </div>
  );
}
