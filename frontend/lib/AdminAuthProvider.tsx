"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { adminApi, setAdminToken, getAdminToken } from "@/lib/adminApi";
import { ApiError } from "@/lib/apiClient";

export type StaffRole = "Admin" | "Delivery";
type StaffSession = { username: string; displayName: string | null; role: StaffRole };

type AdminAuthState = {
  session: StaffSession | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<StaffSession>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);
const SESSION_KEY = "cs_admin_session";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StaffSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    const raw = token ? localStorage.getItem(SESSION_KEY) : null;
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage post-mount to avoid SSR mismatch
        setSession(JSON.parse(raw));
      } catch {
        setAdminToken(null);
      }
    }
    setLoading(false);
  }, []);

  async function login(username: string, password: string) {
    const res = await adminApi.login(username, password);
    setAdminToken(res.token);
    const s: StaffSession = { username: res.username, displayName: res.displayName, role: res.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
    return s;
  }

  function logout() {
    setAdminToken(null);
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return <AdminAuthContext.Provider value={{ session, loading, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export { ApiError };
