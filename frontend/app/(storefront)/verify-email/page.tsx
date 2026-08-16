"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, ApiError } from "@/lib/AuthProvider";
import { apiClient } from "@/lib/apiClient";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing verification token.");
      return;
    }
    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/account"), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setError(err instanceof ApiError ? err.message : "This verification link is invalid or has expired.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for the token present on mount
  }, [token]);

  async function resend() {
    const email = prompt("Enter the email you signed up with to get a new verification link:");
    if (!email) return;
    await apiClient.resendVerification(email);
    setResent(true);
  }

  return (
    <div className="container-cs flex justify-center py-24">
      <div className="w-full max-w-sm rounded-3xl border-2 border-navy/10 p-8 text-center">
        {status === "verifying" && (
          <>
            <p className="text-4xl">⏳</p>
            <h1 className="mt-4 font-display text-xl font-extrabold text-navy">Verifying your email…</h1>
          </>
        )}
        {status === "success" && (
          <>
            <p className="text-4xl">✅</p>
            <h1 className="mt-4 font-display text-xl font-extrabold text-navy">Email verified!</h1>
            <p className="mt-2 text-sm text-navy/60">Redirecting you to your account…</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-4xl">⚠️</p>
            <h1 className="mt-4 font-display text-xl font-extrabold text-navy">Verification failed</h1>
            <p className="mt-2 text-sm text-navy/60">{error}</p>
            {!resent ? (
              <button onClick={resend} className="mt-4 text-sm font-bold text-pink underline">
                Send a new verification link
              </button>
            ) : (
              <p className="mt-4 text-sm text-lime">New link sent — check your inbox.</p>
            )}
            <p className="mt-6 text-xs text-navy/50">
              <Link href="/login" className="font-bold text-pink">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
