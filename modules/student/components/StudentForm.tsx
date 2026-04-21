// modules/student/components/StudentForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, CalendarDays, Users, LucideIcon } from 'lucide-react';
import { Input }   from '@/components/ui/Input';
import { Button }  from '@/components/ui/Button';
import { fadeUp }  from '@/lib/motion';
import { useCreateStudent } from '../hooks/useCreateStudent';
import { createStudentSchema } from '../schema';
import type { CreateStudentInput } from '../types/student.types';

// ─────────────────────────────────────────────────────────────────────────────

type FieldKey = keyof CreateStudentInput;

const FIELDS: {
  key:         FieldKey;
  label:       string;
  placeholder: string;
  type?:       string;
  Icon:        LucideIcon;
  half?:       boolean;
}[] = [
  { key: 'name',          label: 'Full name',        placeholder: 'Arjun Sharma',       Icon: User,          half: true  },
  { key: 'phone',         label: 'Mobile',            placeholder: '+91 98765 43210',    Icon: Phone,         half: true, type: 'tel'   },
  { key: 'email',         label: 'Email address',    placeholder: 'arjun@example.com',  Icon: Mail,          type: 'email' },
  { key: 'course',        label: 'Course',            placeholder: 'IIT JEE / NEET / CA',Icon: BookOpen,      half: true  },
  { key: 'batch',         label: 'Batch',             placeholder: '2024–25',            Icon: Users,         half: true  },
  { key: 'admissionDate', label: 'Admission date',   placeholder: '',                   Icon: CalendarDays,  type: 'date' },
];

const INITIAL: CreateStudentInput = {
  name: '', email: '', phone: '', course: '', batch: '', admissionDate: '',
};

// ─────────────────────────────────────────────────────────────────────────────

interface StudentFormProps {
  onSuccess?: () => void;
}

export function StudentForm({ onSuccess }: StudentFormProps) {
  const [form, setForm]       = useState<CreateStudentInput>(INITIAL);
  const [errors, setErrors]   = useState<Partial<Record<FieldKey, string>>>({});
  const { mutate, isPending } = useCreateStudent();

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createStudentSchema.safeParse(form);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(
        Object.entries(fe).map(([k, v]) => [k, v?.[0]])
      ) as Partial<Record<FieldKey, string>>);
      return;
    }
    setErrors({});

    mutate(form, {
      onSuccess: () => {
        setForm(INITIAL);
        onSuccess?.();
      },
    });
  };

  // Split fields into pairs for half-width layout
  const rows: typeof FIELDS[number][][] = [];
  let i = 0;
  while (i < FIELDS.length) {
    const f = FIELDS[i];
    if (f.half && FIELDS[i + 1]?.half) {
      rows.push([f, FIELDS[i + 1]]);
      i += 2;
    } else {
      rows.push([f]);
      i++;
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      noValidate
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {rows.map((row, ri) => (
        <div key={ri} className={row.length === 2 ? 'grid grid-cols-2 gap-4' : ''}>
          {row.map(({ key, label, placeholder, type, Icon }) => (
            <Input
              key={key}
              label={label}
              type={type ?? 'text'}
              value={form[key]}
              onChange={set(key)}
              placeholder={placeholder}
              icon={<Icon size={14} />}
              error={errors[key]}
              required={key !== 'admissionDate'}
            />
          ))}
        </div>
      ))}

      <Button
        type="submit"
        loading={isPending}
        fullWidth
        loadingText="Adding student…"
        className="mt-2"
      >
        Add Student
      </Button>
    </motion.form>
  );
}
