// modules/student/hooks/useCreateStudent.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent } from '../api';
import type { Student } from '../types/student.types';
import { useToast } from '@/components/ui/Toast';
import { analytics } from '@/lib/analytics';
import type { CreateStudentInput } from '../types/student.types';

export function useCreateStudent() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: (student) => {
      qc.invalidateQueries({ queryKey: ['students'] });
      analytics.event('student_created', {
        course: student.course,
        batch:  student.batch,
      });
      toast.success('Student added', `${student.name} has been enrolled.`);
    },
    onError: () => {
      analytics.error('student_create', 'mutation failed');
      toast.error('Failed to add student', 'Please check the details and try again.');
    },
  });
}
