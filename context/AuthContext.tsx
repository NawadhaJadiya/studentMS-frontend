"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "student" | "admin";

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  identifier: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
  isAuthenticated: false,
  role: null,
  identifier: null,
  isLoading: true,
});

  useEffect(() => {
  const token = getTokenFromCookies();

  if (!token) {
    setAuth((prev) => ({ ...prev, isLoading: false }));
    return;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    setAuth((prev) => ({ ...prev, isLoading: false }));
    return;
  }

  setAuth({
    isAuthenticated: true,
    role: payload.role,
    identifier: payload.rollno || payload.user_name || null,
    isLoading: false,
  });
}, []);

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    setAuth({
      isAuthenticated: false,
      role: null,
      identifier: null,
      isLoading: false,
    });
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider value={{ ...auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

/* ----------------- Helpers ----------------- */

function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

function decodeJWT(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
