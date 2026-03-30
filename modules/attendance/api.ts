import { api } from "@/lib/api";
import { Student } from "@/types";

// ✅ FIXED FUNCTION
export const getAttendance = async (): Promise<Student[]> => {
  const res = await api.get<Student[]>("/attendance");
  return res.data; // 🔥 MOST IMPORTANT
};

// ✅ MARK ATTENDANCE
export const markAttendance = async (data: {
  absent_ids: string[];
}) => {
  const res = await api.post("/attendance", data);
  return res.data;
};