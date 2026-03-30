"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAttendance,
  markAttendance,
} from "@/modules/attendance/api";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Student } from "@/types";

export default function AttendancePage() {
  // ✅ Typed Query
  const { data, isLoading, error } = useQuery<Student[]>({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });

  // ✅ Mutation
  const mutation = useMutation({
    mutationFn: markAttendance,
  });

  // ✅ Clean Data (NO .data)
  const students = data ?? [];

  // ✅ State
  const [absent, setAbsent] = useState<string[]>([]);

  // Toggle attendance
  const toggleAbsent = (id: string) => {
    setAbsent((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // Mark all absent
  const markAllAbsent = () => {
    setAbsent(students.map((s) => s.id));
  };

  // Reset all
  const clearAll = () => {
    setAbsent([]);
  };

  // Loading state
  if (isLoading)
    return <p className="p-6 text-gray-400">Loading...</p>;

  // Error state
  if (error)
    return <p className="p-6 text-red-400">Error loading attendance</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Attendance
      </h2>

      {/* Bulk Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={markAllAbsent}
          className="px-3 py-1 rounded-lg border border-red-400 text-red-400"
        >
          Mark All Absent
        </button>

        <button
          onClick={clearAll}
          className="px-3 py-1 rounded-lg border border-green-400 text-green-400"
        >
          Reset (All Present)
        </button>
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <span>{s.name}</span>

            <button
              onClick={() => toggleAbsent(s.id)}
              className={`px-3 py-1 rounded-lg border transition ${
                absent.includes(s.id)
                  ? "border-red-400 text-red-400"
                  : "border-green-400 text-green-400"
              }`}
            >
              {absent.includes(s.id)
                ? "Absent ❌"
                : "Present ✅"}
            </button>
          </div>
        ))}
      </div>

      {/* Submit */}
      <Button
        className="mt-6"
        loading={mutation.isPending}
        onClick={() =>
          mutation.mutate({
            absent_ids: absent,
          })
        }
      >
        Submit Attendance
      </Button>
    </div>
  );
}