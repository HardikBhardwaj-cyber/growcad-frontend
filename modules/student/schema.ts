// modules/student/schema.ts
import { z } from 'zod';

export const createStudentSchema = z.object({
  name:          z.string().min(2, 'Enter student name'),
  email:         z.string().email('Enter valid email'),
  phone:         z.string().min(10, 'Enter valid mobile'),
  course:        z.string().min(1, 'Select a course'),
  batch:         z.string().min(1, 'Enter batch'),
  admissionDate: z.string().optional(),
});

export type CreateStudentValidated = z.infer<typeof createStudentSchema>;
