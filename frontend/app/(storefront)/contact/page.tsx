"use client";

import { useState } from "react";
import { CandyArt } from "@/lib/candyArt";
import { useCatalog } from "@/lib/CatalogProvider";

export default function ContactPage() {
  const { settings } = useCatalog();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="container-cs py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-purple">Get In Touch</p>
        <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-navy/70">
          Questions about an order, a flavor request, or just want to say hi? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-navy/15 p-6">
            <div className="mb-4 h-16 w-16">
              <CandyArt color="#7B2FF7" id="contact-art" className="h-full w-full" />
            </div>
            <ul className="space-y-3 text-sm text-navy/75">
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Store Address</p>
                <p>{settings?.storeAddress}</p>
              </li>
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Phone</p>
                <p>{settings?.storePhone}</p>
              </li>
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Email</p>
                <p>{settings?.storeEmail}</p>
              </li>
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Hours</p>
                <p>{settings?.storeHours}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-navy p-6">
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <p className="text-4xl">🍬</p>
              <h2 className="mt-4 font-display text-xl font-bold text-navy">Thanks for reaching out!</h2>
              <p className="mt-2 text-sm text-navy/60">We&apos;ll get back to you at {email} soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pink"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
