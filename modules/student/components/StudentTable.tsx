"use client";

import { useState } from "react";
import { useStudents } from "../hooks/useStudents";
import { StudentCard } from "./StudentCard";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/skeleton"; // ✅ FIXED

// ✅ TYPE
type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
};

export function StudentTable() {
  const { data, isLoading } = useStudents();
  const [search, setSearch] = useState("");

  // ✅ SAFE DATA CAST (until API typed fully)
  const students = (data ?? []) as Student[];

  if (isLoading) return <Skeleton />;

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search students..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <StudentCard key={s.id} student={s} />
        ))}
      </div>
    </div>
  );
}