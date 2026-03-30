"use client";

import StudentForm from "./components/StudentForm";
import { StudentTable } from "./components/StudentTable";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <StudentForm />
      <StudentTable />
    </div>
  );
}