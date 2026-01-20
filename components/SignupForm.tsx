"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    rollno: "",
    password: "",
    class: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: ""
  });



  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    // Validation
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }
    if (form.name.trim().length < 2) {
      alert("Name must be at least 2 characters long");
      return;
    }

    if (!form.rollno.trim()) {
      alert("Roll number is required");
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(form.rollno.trim())) {
      alert("Roll number should contain only letters and numbers");
      return;
    }

    if (!form.password) {
      alert("Password is required");
      return;
    }
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (!form.class.trim()) {
      alert("Class is required");
      return;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      alert("Please enter a valid email address");
      return;
    }

    if (!form.phone.trim()) {
      alert("Phone number is required");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (!form.addressLine1.trim()) {
      alert("Address Line 1 is required");
      return;
    }

    const res = await api.post("/students", {
      class: form.class.trim(),
      name: form.name.trim(),
      password: form.password,
      rollno: form.rollno.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
    });

    document.cookie = `token=${res.data.access_token}; path=/`;
    window.location.href = "/student";
  };


  return (
    <div>
      {Object.entries(form).map(([key, value]) => (
        <input
          key={key}
          name={key}
          placeholder={key.toUpperCase()}
          className="w-full mb-3 p-2 border rounded"
          value={value}
          onChange={handleChange}
        />
      ))}

      <button
        onClick={handleSignup}
        className="w-full py-2 bg-[var(--color-gold)] rounded font-semibold"
      >
        Sign Up
      </button>
    </div>
  );
}
