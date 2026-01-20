"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface Student {
  id: number;
  name: string;
  rollno: string;
  class: string;
  marks?: any;
}

export default function AdminHome() {
  const { identifier } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/students");
        setStudents(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <p className="p-6">Loading students...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Welcome Admin {identifier}
      </h1>

      <div className="bg-white p-6 rounded-lg border border-[var(--color-gold)]">
        <h2 className="text-xl font-semibold mb-4">Students</h2>

        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div className="grid gap-4">
            {students.map((student) => (
              <a
                key={student.id}
                href={`/admin/students/${student.rollno}`}
                className="block p-4 border rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-gray-600">Roll No: {student.rollno}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Class: {student.class}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
