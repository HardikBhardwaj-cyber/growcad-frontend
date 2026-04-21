// modules/student/types/student.types.ts

export interface Student {
  id:             string;
  name:           string;
  email:          string;
  phone:          string;
  course:         string;
  batch:          string;
  status:         'active' | 'inactive' | 'graduated';
  feesStatus:     'paid' | 'partial' | 'pending';
  admissionDate:  string;
  avatar?:        string;
  tenantId:       string;
}

export interface CreateStudentInput {
  name:           string;
  email:          string;
  phone:          string;
  course:         string;
  batch:          string;
  admissionDate?: string;
}
