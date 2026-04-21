import { get, post, del } from "@/lib/api";
import type { Student, CreateStudentInput } from "./types/student.types";

export type StudentsResponse = {
  data: Student[];
  totalPages: number;
};

export const getStudents = async (params: {
  page: number;
  search?: string;
  course?: string;
}): Promise<StudentsResponse> => {
  return await get<StudentsResponse>("/students", params);
};

export const createStudent = async (
  data: CreateStudentInput
): Promise<Student> => {
  return await post<Student>("/students", data);
};

export const deleteStudent = async (id: string): Promise<void> => {
  return await del<void>(`/students/${id}`);
};