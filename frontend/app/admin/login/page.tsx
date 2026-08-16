"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdminAuth, ApiError } from "@/lib/AdminAuthProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const session = await login(username, password);
      router.push(session.role === "Admin" ? "/admin/dashboard" : "/admin/orders");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Candy Station" width={64} height={64} className="h-16 w-16 object-contain" />
          <h1 className="mt-3 font-display text-xl font-extrabold text-navy">Staff Login</h1>
          <p className="mt-1 text-xs text-navy/50">Admin &amp; Delivery access only</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}
          <input
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pink disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-navy/40">
          Demo: admin / admin123 (Admin) · rider1 / rider123 (Delivery)
        </p>
      </div>
    </div>
  );
}
