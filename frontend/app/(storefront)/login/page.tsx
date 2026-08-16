"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ApiError } from "@/lib/AuthProvider";
import { apiClient } from "@/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    try {
      await login(email, password);
      router.push("/account");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setNeedsVerification(true);
        setError(err.message);
      } else {
        setError(err instanceof ApiError ? err.message : "Invalid email or password. Try aarav@example.com / demo123.");
      }
    }
  }

  async function handleResend() {
    setResendStatus("sending");
    try {
      await apiClient.resendVerification(email);
      setResendStatus("sent");
    } catch {
      setResendStatus("idle");
    }
  }

  return (
    <div className="container-cs flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl font-extrabold text-navy">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-navy/60">Demo: aarav@example.com / demo123</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">
              <p>{error}</p>
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus !== "idle"}
                  className="mt-2 font-bold underline disabled:opacity-60"
                >
                  {resendStatus === "sent" ? "Verification email sent ✓" : resendStatus === "sending" ? "Sending…" : "Resend verification email"}
                </button>
              )}
            </div>
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="w-full rounded-full bg-navy py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pink">
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy/60">
          New here?{" "}
          <Link href="/signup" className="font-bold text-pink">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
