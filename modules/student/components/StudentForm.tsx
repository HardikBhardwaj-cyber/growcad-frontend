"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateStudent } from "../hooks/useCreateStudent";

// ✅ TYPE
type StudentFormData = {
  name: string;
  email: string;
  phone: string;
  course: string;
};

export default function StudentForm() {
  const [form, setForm] = useState<StudentFormData>({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const { mutate, isPending } = useCreateStudent();

  const handleSubmit = () => {
    mutate(form);
  };

  // ✅ CLEAN HANDLER
  const handleChange =
    (field: keyof StudentFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Name"
        value={form.name}
        onChange={handleChange("name")}
      />

      <Input
        placeholder="Email"
        value={form.email}
        onChange={handleChange("email")}
      />

      <Input
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange("phone")}
      />

      <Input
        placeholder="Course"
        value={form.course}
        onChange={handleChange("course")}
      />

      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Adding..." : "Add Student"}
      </Button>
    </div>
  );
}