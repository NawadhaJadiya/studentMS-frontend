"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      window.location.href = "/auth";
    } else if (role !== "student") {
      window.location.href = "/admin";
    }
  }, [isAuthenticated, role, isLoading]);

  if (isLoading) return null;
  if (!isAuthenticated || role !== "student") return null;

  return (
  <>
    <Navbar
      title="Student Portal"
      menuItems={[
        { label: "Profile", href: "/student" },
        { label: "Results", href: "/student/results" },
        { label: "Update Password", href: "/student/update-password" },
        { label: "Logout", href: "#" },
      ]}
    />
    <main className="p-6">{children}</main>
  </>
);
}
