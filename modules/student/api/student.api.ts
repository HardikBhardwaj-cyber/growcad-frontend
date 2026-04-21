import { get, post } from "@/lib/api";

// ✅ TYPES
export type Student = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course?: string;
};

// 👇 INPUT TYPE
export type CreateStudentInput = {
  name: string;
  phone: string;
  email?: string;
  course?: string;
};

// ✅ GET STUDENTS
export const getStudents = async (): Promise<Student[]> => {
  return await get<Student[]>("/students");
};

// ✅ CREATE STUDENT
export const createStudent = async (
  data: CreateStudentInput
): Promise<Student> => {
  return await post<Student>("/students", data);
};