// modules/student/index.tsx
export { StudentTable }   from './components/StudentTable';
export { StudentCard }    from './components/StudentCard';
export { StudentForm }    from './components/StudentForm';
export { useStudents }    from './hooks/useStudents';
export { useCreateStudent } from './hooks/useCreateStudent';
export { getStudents, createStudent, deleteStudent } from './api';
export { createStudentSchema } from './schema';
export type { Student, CreateStudentInput } from './types/student.types';
