"use client";

import { useState } from "react";
import api from "@/lib/axios";

type Role = "student" | "admin";

export default function LoginForm({ role }: { role: Role }) {
  const [rollno, setRollno] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    // Validation
    if (role === "student") {
      if (!rollno.trim()) {
        setError("Roll number is required");
        return;
      }
      if (!/^[A-Za-z0-9]+$/.test(rollno.trim())) {
        setError("Roll number should contain only letters and numbers");
        return;
      }
    } else {
      if (!rollno.trim()) {
        setError("Username is required");
        return;
      }
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    

    const payload =
      role === "admin"
        ? { user_name: rollno.trim(), password }
        : { rollno: rollno.trim(), password };

    const endpoint =
      role === "admin" ? "/admin/login" : "/students/login";

    try {
      const res = await api.post(endpoint, payload);

      document.cookie = `token=${res.data.access_token}; path=/`;
      
      // Decode token to get role
      const payloadToken = res.data.access_token.split(".")[1];
      const decoded = JSON.parse(atob(payloadToken));
      const userRole = decoded.role;
      
      // Redirect based on role
      window.location.href = userRole === "admin" ? "/admin" : "/student";
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div>
      <input
        placeholder={role === "admin" ? "user name" : "Roll Number"}
        className="w-full mb-3 p-2 border rounded"
        value={rollno}
        onChange={(e) => setRollno(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full py-2 bg-[var(--color-gold)] rounded font-semibold"
      >
        Login
      </button>
    </div>
  );
}
