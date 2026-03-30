import { api } from "@/lib/api";

// ✅ TYPES
export type Student = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course?: string;
};

// 👇 INPUT TYPE (VERY IMPORTANT)
export type CreateStudentInput = {
  name: string;
  phone: string;
  email?: string;
  course?: string;
};

// ✅ GET STUDENTS
export const getStudents = async (): Promise<Student[]> => {
  const res = await api.get<Student[]>("/students");
  return res.data;
};

// ✅ CREATE STUDENT (NO ANY ❌)
export const createStudent = async (
  data: CreateStudentInput
): Promise<Student> => {
  const res = await api.post<Student>("/students", data);
  return res.data;
};