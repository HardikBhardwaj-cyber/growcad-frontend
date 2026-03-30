"use client";

import { useState, memo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getStudents,
  createStudent,
  Student,
  CreateStudentInput,
} from "@/modules/student/api";

import Button from "@/components/ui/Button";
import { useDebounce } from "use-debounce";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/shared/State";
import toast from "react-hot-toast";

// ✅ MEMO COMPONENT
const StudentItem = memo(({ s }: { s: Student }) => {
  return (
    <div className="p-3 border border-white/10 rounded-xl flex justify-between bg-white/5">
      <span>{s.name}</span>
      <span className="text-sm text-gray-400">{s.phone}</span>
    </div>
  );
});
StudentItem.displayName = "StudentItem";

export default function StudentsPage() {
  const queryClient = useQueryClient(); // 🔥 FIX

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  // ✅ QUERY
  const { data, isLoading, error } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  // ✅ MUTATION
  const mutation = useMutation({
    mutationFn: createStudent,

    onMutate: async (newStudent: CreateStudentInput) => {
      await queryClient.cancelQueries({ queryKey: ["students"] });

      const prev = queryClient.getQueryData<Student[]>(["students"]);

      queryClient.setQueryData<Student[]>(["students"], (old = []) => [
        ...old,
        {
          id: "temp-" + Date.now(),
          ...newStudent,
        },
      ]);

      return { prev };
    },

    onError: (_err, _new, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["students"], context.prev);
      }
      toast.error("Failed to add student");
    },

    onSuccess: () => {
      toast.success("Student added");
      setName("");
      setPhone("");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  // ✅ STATES
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  // ✅ SEARCH FILTER
  const students =
    data?.filter((s) =>
      s.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) ?? [];

  if (!students.length)
    return <EmptyState text="No students yet" />;

  // ✅ ADD HANDLER
  const handleAdd = () => {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }

    if (!phone.match(/^[0-9]{10}$/)) {
      toast.error("Invalid phone");
      return;
    }

    mutation.mutate({
      name,
      phone,
      email: "",
      course: "general",
    });
  };

  return (
    <div className="p-4 md:p-6">
      {/* ADD */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-2 border border-white/10 rounded-xl bg-white/5 w-full"
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="p-2 border border-white/10 rounded-xl bg-white/5 w-full"
        />

        <Button loading={mutation.isPending} onClick={handleAdd}>
          Add
        </Button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 mb-4 border border-white/10 rounded-xl bg-white/5 w-full"
      />

      {/* LIST */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {students.map((s) => (
          <StudentItem key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}