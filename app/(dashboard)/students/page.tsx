// app/(dashboard)/students/page.tsx
'use client';
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import  PageWrapper  from '@/components/shared/PageWrapper';
import { Section }     from '@/components/ui/section';
import { Button }      from '@/components/ui/Button';
import { Input }       from '@/components/ui/Input';
import { Modal }       from '@/components/ui/modal';
import { StudentTable } from '@/modules/student/components/StudentTable';
import { StudentForm }  from '@/modules/student/components/StudentForm';

export default function StudentsPage() {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');

  return (
    <PageWrapper>
      <motion.div className="mb-6" variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">Students</h1>
        <p className="mt-1 text-[13.5px] text-white/40">
          View, search, and manage every enrolled student.
        </p>
      </motion.div>
      <Section
        title="Students"
        subtitle="Manage your institute's students"
        action={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus size={14} /> Add Student
          </Button>
        }
      >
        {/* Search */}
        <div className="mb-4 max-w-sm">
          <Input
            placeholder="Search by name, email, course…"
            icon={<Search size={13} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <StudentTable search={search} />
      </Section>

      <Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Add Student"
>
  <StudentForm onSuccess={() => setOpen(false)} />
</Modal>
    </PageWrapper>
  );
}
