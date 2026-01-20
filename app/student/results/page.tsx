"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface Mark {
  subject: string;
  score: number;
}

export default function StudentResultPage() {
  const { identifier } = useAuth(); // rollno from JWT
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!identifier) return;

    const fetchResults = async () => {
      try {
        const res = await api.get(`/students/${identifier}/result`);
        setMarks(res.data.marks); // assuming { marks: [...] }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [identifier]);

  if (loading) {
    return <p className="p-6">Loading results...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }
  
  if (!marks || marks.length === 0) {
    return <p className="p-6">No results available.</p>;
  }

  const total = marks.reduce((sum, m) => sum + m.score, 0);
  const percentage = (total / (marks.length * 100)) * 100;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-[var(--color-gold)]">
      <h2 className="text-xl font-semibold mb-6">Results</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Subject</th>
            <th className="text-right py-2">Marks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark) => (
            <tr key={mark.subject} className="border-b last:border-b-0">
              <td className="py-2">{mark.subject}</td>
              <td className="py-2 text-right">{mark.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <p className="font-medium">
          Percentage:{" "}
          <span className="font-semibold">
            {percentage.toFixed(2)}%
          </span>
        </p>
      </div>
    </div>
  );
}
