"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/AuthProvider";

export default function SignupPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, phone, password);
      setSubmittedEmail(email);
    } catch (err) {
      setError(err instanceof ApiError && err.status === 409 ? "An account with this email already exists." : "Could not create your account. Please try again.");
    }
  }

  if (submittedEmail) {
    return (
      <div className="container-cs flex justify-center py-16">
        <div className="w-full max-w-sm rounded-3xl border-2 border-lime bg-lime/10 p-8 text-center">
          <p className="text-4xl">📧</p>
          <h1 className="mt-4 font-display text-xl font-extrabold text-navy">Check your inbox!</h1>
          <p className="mt-3 text-sm text-navy/70">
            We&apos;ve sent a verification link to <span className="font-semibold">{submittedEmail}</span>. Click it to
            activate your account and sign in.
          </p>
          <p className="mt-4 text-xs text-navy/50">
            Didn&apos;t get it? Check spam, or head to{" "}
            <Link href="/login" className="font-bold text-pink">
              login
            </Link>{" "}
            to resend it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-cs flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl font-extrabold text-navy">Create Account</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p className="rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}
          <input
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/20 px-4 py-3 text-sm focus:border-pink focus:outline-none"
          />
          <input
            required
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy/60">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-pink">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
