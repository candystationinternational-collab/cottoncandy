"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiClient, getToken, setToken, ApiError } from "@/lib/apiClient";

type Session = { name: string; email: string };

type AuthState = {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<string>;
  verifyEmail: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await apiClient.getMe();
        setSession({ name: me.name, email: me.email });
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  async function login(email: string, password: string) {
    const res = await apiClient.login(email, password);
    setToken(res.token);
    setSession({ name: res.name, email: res.email });
  }

  /** Account is created unverified — no session/token yet. Returns the confirmation message to show. */
  async function register(name: string, email: string, phone: string, password: string) {
    const res = await apiClient.register(name, email, phone, password);
    return res.message;
  }

  /** Clicking the emailed link both verifies the account and logs the customer in. */
  async function verifyEmail(token: string) {
    const res = await apiClient.verifyEmail(token);
    setToken(res.token);
    setSession({ name: res.name, email: res.email });
  }

  function logout() {
    setToken(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, loading, login, register, verifyEmail, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
