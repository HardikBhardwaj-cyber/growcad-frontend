import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent } from "../api/student.api";

export const useCreateStudent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
};