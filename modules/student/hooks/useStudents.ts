import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../api";
import type { StudentsResponse } from "../api";

export const useStudents = (params: {
  page: number;
  search?: string;
  course?: string;
}) => {
  return useQuery<StudentsResponse>({
    queryKey: ['students', params],
    queryFn: () => getStudents(params),
  });
};