"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      window.location.href = "/auth";
    } else if (role !== "admin") {
      window.location.href = "/student";
    }
  }, [isAuthenticated, role, isLoading]);

  if (isLoading) return null;
  if (!isAuthenticated || role !== "admin") return null;

  
return (
  <>
    <Navbar
      title="Admin Portal"
      menuItems={[
        { label: "Students", href: "/admin" },
        { label: "Create Admin", href: "/admin/create" },
        { label: "Update Password", href: "/admin/update-password" },
        { label: "Logout", href: "#" },
      ]}
    />
    <main className="p-6">{children}</main>
  </>
);

}
