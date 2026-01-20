"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import BurgerMenu from "./BurgerMenu";

interface NavbarProps {
  title: string;
  menuItems: { label: string; href: string }[];
}

export default function Navbar({ title, menuItems }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-gold)]">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left */}
        <h1 className="text-lg font-semibold text-[var(--color-brown)]">
          {title}
        </h1>

        {/* Center (desktop nav) */}
        <nav className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            item.label === "Logout" ? (
              <button
                key={item.href}
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                {item.label}
              </button>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:underline"
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        {/* Right (burger menu trigger) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl font-bold"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {open && <BurgerMenu onClose={() => setOpen(false)} />}
    </header>
  );
}
