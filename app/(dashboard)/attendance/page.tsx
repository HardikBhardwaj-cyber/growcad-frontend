"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { attendanceApi, type AttendanceRecord } from "@/modules/attendance/api";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];

  const { data, isLoading, error } = useQuery<AttendanceRecord[]>({
    queryKey: ["attendance", today],
    queryFn: () => attendanceApi.list(today),
  });

  const mutation = useMutation({
    mutationFn: attendanceApi.mark,
  });

  const students = data ?? [];

  const [absent, setAbsent] = useState<string[]>([]);

  const toggleAbsent = (id: string) => {
    setAbsent((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const markAllAbsent = () => {
    setAbsent(students.map((s) => s.studentId));
  };

  const clearAll = () => {
    setAbsent([]);
  };

  if (isLoading)
    return <p className="p-6 text-gray-400">Loading...</p>;

  if (error)
    return <p className="p-6 text-red-400">Error loading attendance</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Attendance</h2>

      <div className="flex gap-2 mb-4">
        <button onClick={markAllAbsent} className="px-3 py-1 rounded-lg border border-red-400 text-red-400">
          Mark All Absent
        </button>

        <button onClick={clearAll} className="px-3 py-1 rounded-lg border border-green-400 text-green-400">
          Reset (All Present)
        </button>
      </div>

      <div className="space-y-2">
        {students.map((s) => (
          <div
            key={s.studentId}
            className="flex justify-between items-center p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <span>{s.name}</span>

            <button
              onClick={() => toggleAbsent(s.studentId)}
              className={`px-3 py-1 rounded-lg border transition ${
                absent.includes(s.studentId)
                  ? "border-red-400 text-red-400"
                  : "border-green-400 text-green-400"
              }`}
            >
              {absent.includes(s.studentId) ? "Absent ❌" : "Present ✅"}
            </button>
          </div>
        ))}
      </div>

      <Button
        className="mt-6"
        loading={mutation.isPending}
        onClick={() =>
          mutation.mutate(
            students.map((s) => ({
              studentId: s.studentId,
              status: absent.includes(s.studentId) ? "absent" : "present",
              date: today,
            }))
          )
        }
      >
        Submit Attendance
      </Button>
    </div>
  );
}