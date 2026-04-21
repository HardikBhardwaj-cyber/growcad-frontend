// modules/attendance/api.ts
import { get, post } from '@/lib/api';

export interface AttendanceRecord {
  studentId: string;
  name:      string;
  course:    string;
  batch:     string;
  status?:   'present' | 'absent' | 'late';
}

export interface MarkPayload {
  studentId: string;
  status:    'present' | 'absent' | 'late';
  date:      string;
}

export const attendanceApi = {
  /** List students for a given date — pre-filled with any existing marks */
  list: (date: string) =>
    get<AttendanceRecord[]>('/attendance', { date }),

  /** Bulk-mark attendance for all students */
  mark: (records: MarkPayload[]) =>
    post<{ saved: number }>('/attendance/mark', { records }),

  /** Monthly summary for a batch */
  summary: (params: { batch?: string; month?: string }) =>
    get<{ date: string; present: number; absent: number; late: number }[]>(
      '/attendance/summary', params
    ),
};
