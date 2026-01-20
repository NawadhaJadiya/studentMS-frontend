"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface StudentProfile {
  name: string;
  rollno: string;
  class: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
}

export default function StudentProfilePage() {
  const { identifier } = useAuth(); // identifier === rollno
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!identifier) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/students/${identifier}`);
        setProfile(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [identifier]);

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-[var(--color-gold)]">
      <h2 className="text-xl font-semibold mb-6">
        Student Profile
      </h2>

      <ProfileRow label="Name" value={profile.name} />
      <ProfileRow label="Roll No" value={profile.rollno} />
      <ProfileRow label="Class" value={profile.class} />
      <ProfileRow label="Email" value={profile.email} />
      <ProfileRow label="Phone" value={profile.phone} />
      <ProfileRow label="Address" value={profile.addressLine1} />
      {profile.addressLine2 && (
        <ProfileRow label="Address Line 2" value={profile.addressLine2} />
      )}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="font-medium">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
