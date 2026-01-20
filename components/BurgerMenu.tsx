"use client";

import { useAuth } from "@/context/AuthContext";

export default function BurgerMenu({ onClose }: { onClose: () => void }) {
  const { role, logout } = useAuth();

  const handleMenuClick = (href: string) => {
    if (href === "#") {
      logout();
    } else {
      window.location.href = href;
    }
    onClose();
  };

  return (
    <div className="absolute right-6 top-16 w-60 bg-white border border-[var(--color-gold)] rounded-lg shadow-lg">
      <ul className="flex flex-col divide-y">
        {/* STUDENT MENU */}
        {role === "student" && (
          <>
            <li>
              <button
                onClick={() => handleMenuClick("/student")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Profile
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuClick("/student/results")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Results
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuClick("/student/update-password")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Update Password
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuClick("#")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Logout
              </button>
            </li>
          </>
        )}

        {/* ADMIN MENU */}
        {role === "admin" && (
          <>
            <li>
              <button
                onClick={() => handleMenuClick("/admin")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Students
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuClick("/admin/create")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Create Admin
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuClick("/admin/update-password")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Update Password
              </button>
            </li>

            <li>
              <button
                onClick={() => handleMenuClick("#")}
                className="w-full text-left block px-4 py-3 hover:bg-[var(--color-creme)]"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
