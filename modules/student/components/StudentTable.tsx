// modules/student/components/StudentTable.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Mail, Phone, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Card }     from '@/components/ui/card';
import { Badge }    from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button }   from '@/components/ui/Button';
import { Modal }    from '@/components/ui/modal';
import { fadeUp, staggerContainer, EASE_OUT } from '@/lib/motion';
import { theme }    from '@/styles/theme';
import { cn, getInitials } from '@/lib/utils';
import { useStudents } from '../hooks/useStudents';
import { useCreateStudent } from '../hooks/useCreateStudent';
import { deleteStudent } from '../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Student } from '../types/student.types';


// ─── Type maps ────────────────────────────────────────────────────────────────


const STATUS_MAP: Record<Student['status'], 'success' | 'warning' | 'default'> = {
  active:    'success',
  inactive:  'warning',
  graduated: 'default',
};

const FEES_MAP: Record<Student['feesStatus'], 'success' | 'danger' | 'warning'> = {
  paid:    'success',
  partial: 'warning',
  pending: 'danger',
};

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortKey = 'name' | 'course' | 'status';
type SortDir = 'asc' | 'desc';

// ─── Column header with sort ──────────────────────────────────────────────────

function ColHeader({
  label, sortKey, current, dir, onSort,
}: {
  label:   string;
  sortKey?: SortKey;
  current: SortKey | null;
  dir:     SortDir;
  onSort:  (k: SortKey) => void;
}) {
  const active = sortKey && current === sortKey;
  return (
    <button
      onClick={() => sortKey && onSort(sortKey)}
      className={cn(
        'flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.1em]',
        'transition-colors duration-150',
        active ? 'text-violet-400' : 'text-white/28 hover:text-white/50',
        !sortKey && 'cursor-default',
      )}
    >
      {label}
      {sortKey && (
        <span className="flex flex-col">
          <ChevronUp   size={8} className={cn(active && dir === 'asc'  ? 'text-violet-400' : 'opacity-30')} />
          <ChevronDown size={8} className={cn(active && dir === 'desc' ? 'text-violet-400' : 'opacity-30')} />
        </span>
      )}
    </button>
  );
}

// ─── Skeleton table — exact same grid as real rows: no layout shift ───────────

function TableSkeleton() {
  return (
    <div aria-hidden>
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] gap-4 border-b border-white/[0.06] px-4 py-3">
        {['Student', 'Contact', 'Course', 'Status', 'Fees', ''].map(h => (
          <Skeleton key={h} className="h-3 w-full max-w-[80px]" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] items-center gap-4 border-b border-white/[0.04] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div>
            <Skeleton className="mb-1 h-3 w-full max-w-[140px]" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function TableEmpty({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Mail size={24} className="text-white/18" aria-hidden />
      <div className="text-center">
        <p className="text-[13.5px] font-medium text-white/50">
          {hasFilters ? 'No students match your filters' : 'No students yet'}
        </p>
        <p className="mt-0.5 text-[12px] text-white/28">
          {hasFilters ? 'Try adjusting your search or filters' : 'Add your first student to get started'}
        </p>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({
  student,
  onClose,
  onConfirm,
  loading,
}: {
  student:   Student | null;
  onClose:   () => void;
  onConfirm: () => void;
  loading:   boolean;
}) {
  return (
    <Modal
      open={Boolean(student)}
      onClose={onClose}
      title="Remove student"
      size="sm"
    >
      <p className="mb-6 text-[13.5px] text-white/55">
        Are you sure you want to remove{' '}
        <span className="font-semibold text-white/80">{student?.name}</span>?
        This cannot be undone.
      </p>
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" loading={loading} onClick={onConfirm}>
          <Trash2 size={13} /> Remove
        </Button>
      </div>
    </Modal>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page, totalPages, onPage,
}: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
      <p className="text-[12px] text-white/32">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary" size="sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="secondary" size="sm"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface StudentTableProps {
  search?: string;
  course?: string;
  status?: Student['status'] | '';
}

export function StudentTable({ search = '', course = '', status = '' }: StudentTableProps) {
  const [page, setPage]           = useState(1);
  const [sortKey, setSortKey]     = useState<SortKey | null>('name');
  const [sortDir, setSortDir]     = useState<SortDir>('asc');
  const [delTarget, setDelTarget] = useState<Student | null>(null);

  const qc = useQueryClient();

  const { data, isLoading } = useStudents({
    page,
    search,
    course: course || undefined,
  });

  const { mutate: del, isPending: deleting } = useMutation({
    mutationFn: deleteStudent,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      setDelTarget(null);
    },
  });

  // Client-side sort (server handles pagination + search)
  const rows = [...(data?.data ?? [])].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  // Filter by status client-side
  const filtered = status ? rows.filter(s => s.status === status) : rows;

  const hasFilters = Boolean(search || course || status);
  const totalPages = data?.totalPages ?? 1;

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }, [sortKey]);

  const COLUMNS = [
    { label: 'Student', sortKey: 'name'   as SortKey },
    { label: 'Contact', sortKey: undefined            },
    { label: 'Course',  sortKey: 'course' as SortKey },
    { label: 'Status',  sortKey: 'status' as SortKey },
    { label: 'Fees',    sortKey: undefined            },
    { label: '',        sortKey: undefined            },
  ];

  return (
    <>
      <Card className="overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] gap-4 border-b border-white/[0.06] px-4 py-3">
          {COLUMNS.map(({ label, sortKey: sk }) => (
            <ColHeader
              key={label}
              label={label}
              sortKey={sk}
              current={sortKey}
              dir={sortDir}
              onSort={handleSort}
            />
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <TableEmpty hasFilters={hasFilters} />
        ) : (
          <motion.div
            variants={staggerContainer(0.04, 0.02)}
            initial="hidden"
            animate="visible"
          >
            {filtered.map(s => (
              <motion.div
                key={s.id}
                variants={fadeUp}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] items-center gap-4 border-b border-white/[0.04] px-4 py-3.5 transition-colors duration-150 hover:bg-white/[0.025] last:border-0"
              >
                {/* Name + avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ background: `${theme.colors.violet[600]}88` }}
                    aria-hidden
                  >
                    {getInitials(s.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white/85">{s.name}</p>
                    <p className="truncate text-[11.5px] text-white/32">{s.batch}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-white/40">
                    <Mail size={10} className="shrink-0" aria-hidden />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-white/40">
                    <Phone size={10} className="shrink-0" aria-hidden />
                    <span>{s.phone}</span>
                  </div>
                </div>

                {/* Course */}
                <span className="truncate text-[12.5px] text-white/60">{s.course}</span>

                {/* Status */}
                <Badge variant={STATUS_MAP[s.status]} size="sm">{s.status}</Badge>

                {/* Fees */}
                <Badge variant={FEES_MAP[s.feesStatus]} size="sm">{s.feesStatus}</Badge>

                {/* Actions */}
                <button
                  onClick={() => setDelTarget(s)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/24 transition-all hover:bg-rose-500/10 hover:text-rose-400"
                  aria-label={`Remove ${s.name}`}
                >
                  <Trash2 size={13} aria-hidden />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </Card>

      {/* Delete confirm modal */}
      <DeleteModal
        student={delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={() => delTarget && del(delTarget.id)}
        loading={deleting}
      />
    </>
  );
}
