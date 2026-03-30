import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../api/student.api";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
};