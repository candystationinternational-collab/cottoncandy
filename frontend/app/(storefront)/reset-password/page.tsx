"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient, ApiError } from "@/lib/apiClient";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing reset token — please use the link from your email.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="container-cs flex justify-center py-16">
        <div className="w-full max-w-sm rounded-3xl border-2 border-lime bg-lime/10 p-8 text-center">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 font-display text-xl font-extrabold text-navy">Password reset!</h1>
          <p className="mt-2 text-sm text-navy/60">Redirecting you to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-cs flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl font-extrabold text-navy">Reset Password</h1>
        <p className="mt-2 text-center text-sm text-navy/60">Choose a new password below.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p className="rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pink disabled:opacity-50"
          >
            {submitting ? "Resetting…" : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
