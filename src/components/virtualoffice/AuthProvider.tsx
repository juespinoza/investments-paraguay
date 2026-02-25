"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Role } from "@/lib/virtualoffice/menu";

export type AuthUser = { id: string; email: string; role: Role };

export type MeResponse =
  | { authenticated: false }
  | { authenticated: true; user: AuthUser };

export type AuthContextValue = {
  me: MeResponse | null; // null = loading
  user: AuthUser | null; // user directo, no nested
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMe(): Promise<MeResponse> {
  const r = await fetch("/api/auth/me", { cache: "no-store" });
  // Si tu API puede devolver 401 sin body, podrías manejarlo acá
  return (await r.json()) as MeResponse;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<MeResponse | null>(null);

  const refresh = async () => {
    try {
      const data = await fetchMe();
      setMe(data);
    } catch {
      setMe({ authenticated: false });
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchMe();
        if (mounted) setMe(data);
      } catch {
        if (mounted) setMe({ authenticated: false });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isLoading = me === null;
    const isAuthenticated = !!me && me.authenticated === true;
    const user = isAuthenticated ? me.user : null;

    return { me, user, isLoading, isAuthenticated, refresh };
  }, [me]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
