"use client";

import { useState, useEffect } from "react";
import RoleToggle from "@/components/RoleToggle";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";



type Role = "student" | "admin";

export default function AuthPage() {
  
  const [role, setRole] = useState<Role>("student");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const { isAuthenticated, role : authRole, isLoading } = useAuth();
  const router = useRouter();
useEffect(() => {
  if (isLoading) return;

  if (isAuthenticated) {
    router.replace(authRole === "student" ? "/student" : "/admin");
  }
}, [isAuthenticated, authRole, isLoading, router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-creme)]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow border border-[var(--color-gold)]">
        <RoleToggle role={role} setRole={setRole} />

        {mode === "login" ? (
          <LoginForm role={role} />
        ) : (
          role === "student" && <SignupForm />
        )}

        {role === "student" && (
          <p
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
            className="text-sm mt-4 cursor-pointer underline text-center"
          >
            {mode === "login"
              ? "Create new account"
              : "Already have an account?"}
          </p>
        )}
      </div>
    </div>
  );
}
