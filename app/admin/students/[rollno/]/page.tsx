"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Student {
  id: number;
  name: string;
  rollno: string;
  class: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  marks?: Record<string, number>;
}

export default function StudentDetailPage({ params }: { params: { rollno: string } }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMarks, setEditingMarks] = useState(false);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${params.rollno}`);
        setStudent(res.data);
        
        // Normalize marks to object format
        const studentMarks = res.data.marks;
        if (Array.isArray(studentMarks)) {
          const marksObj: Record<string, number> = {};
          studentMarks.forEach((m: any) => {
            marksObj[m.subject] = Number(m.score);
          });
          setMarks(marksObj);
        } else if (studentMarks && typeof studentMarks === 'object') {
          setMarks(studentMarks);
        } else {
          setMarks({});
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [params.rollno]);

  const handleSaveMarks = async () => {
    setSaving(true);
    try {
      await api.put(`/students/${params.rollno}/marks`, { marks });
      setStudent(prev => prev ? { ...prev, marks } : null);
      setEditingMarks(false);
      alert("Marks updated successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update marks");
    } finally {
      setSaving(false);
    }
  };

  const addSubject = () => {
    const subject = prompt("Enter subject name:");
    if (subject && !marks[subject]) {
      setMarks(prev => ({ ...prev, [subject]: 0 }));
    }
  };

  const removeSubject = (subject: string) => {
    if (confirm(`Remove ${subject}?`)) {
      setMarks(prev => {
        const newMarks = { ...prev };
        delete newMarks[subject];
        return newMarks;
      });
    }
  };

  if (loading) {
    return <p className="p-6">Loading student details...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!student) {
    return <p className="p-6">Student not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-[var(--color-gold)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Student Details</h2>
        <a
          href="/admin"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Students
        </a>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1">{student.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll No</label>
            <p className="mt-1">{student.rollno}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <p className="mt-1">{student.class}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1">{student.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1">{student.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="mt-1">
              {student.addressLine1}
              {student.addressLine2 && `, ${student.addressLine2}`}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Marks</h3>
            {!editingMarks ? (
              <button
                onClick={() => setEditingMarks(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Marks
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={addSubject}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Add Subject
                </button>
                <button
                  onClick={handleSaveMarks}
                  disabled={saving}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setMarks(student.marks || {});
                    setEditingMarks(false);
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {Object.keys(marks).length === 0 ? (
            <p className="text-gray-500">No marks recorded.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(marks).map(([subject, score]) => (
                <div key={subject} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{subject}</span>
                  {editingMarks ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setMarks(prev => ({ ...prev, [subject]: Number(e.target.value) }))}
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                      <button
                        onClick={() => removeSubject(subject)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono">{score}/100</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}