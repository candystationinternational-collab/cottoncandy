"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.forgotPassword(email);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="container-cs flex justify-center py-16">
        <div className="w-full max-w-sm rounded-3xl border-2 border-lime bg-lime/10 p-8 text-center">
          <p className="text-4xl">📧</p>
          <h1 className="mt-4 font-display text-xl font-extrabold text-navy">Check your inbox</h1>
          <p className="mt-3 text-sm text-navy/70">
            If an account exists for <span className="font-semibold">{email}</span>, we&apos;ve sent a link to reset
            your password. It expires in 1 hour.
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm font-bold text-pink">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-cs flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl font-extrabold text-navy">Forgot Password</h1>
        <p className="mt-2 text-center text-sm text-navy/60">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pink disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy/60">
          <Link href="/login" className="font-bold text-pink">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
