import { api } from "@/lib/api";

// TYPES
export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
};

export type CreateStudentInput = {
  name: string;
  email: string;
  phone: string;
  course: string;
};

// GET STUDENTS
export const getStudents = async (): Promise<Student[]> => {
  const res = await api.get<Student[]>("/students");
  return res.data;
};

// CREATE STUDENT
export const createStudent = async (
  data: CreateStudentInput
): Promise<Student> => {
  const res = await api.post<Student>("/students", data);
  return res.data;
};