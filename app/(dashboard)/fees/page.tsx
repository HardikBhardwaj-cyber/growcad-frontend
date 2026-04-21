'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search, IndianRupee, Clock, CheckCircle2,
} from 'lucide-react';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/State';
import { useToast } from '@/components/ui/Toast';

import { fadeUp, staggerContainer, EASE_OUT } from '@/lib/motion';
import { theme } from '@/styles/theme';
import { formatCurrency, formatDate } from '@/lib/utils';

import { getFees, markPaid, type Fee } from '@/modules/fees/api';

// ─── SUMMARY ─────────────────────────────────

function FeeSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ['fees'],
    queryFn: getFees,
  });

  const fees = data?.list ?? [];

  const total = fees.reduce((sum, f) => sum + f.amount, 0);
  const collected = fees.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0);
  const pending = data?.total_pending ?? 0;

  const stats = [
    { label: 'Total fees', value: total, Icon: IndianRupee, color: theme.colors.violet[500] },
    { label: 'Collected', value: collected, Icon: CheckCircle2, color: theme.colors.emerald[400] },
    { label: 'Pending', value: pending, Icon: Clock, color: theme.colors.amber[400] },
  ];

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ label, value, Icon, color }) => (
        <Card key={label} className="p-4">
          <div className="flex justify-between mb-2">
            <span className="text-white/40 text-sm">{label}</span>
            <Icon size={16} style={{ color }} />
          </div>
          <p className="text-xl font-bold">{formatCurrency(value)}</p>
        </Card>
      ))}
    </div>
  );
}

// ─── MODAL ─────────────────────────────────

function RecordPaymentModal({
  record,
  onClose,
}: {
  record: Fee | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const toast = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => markPaid(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fees'] });
      toast.success('Payment marked');
      onClose();
    },
  });

  return (
    <Modal open={!!record} onClose={onClose} title="Mark Paid">
      {record && (
        <div className="flex flex-col gap-4">
          <p>{record.name}</p>

          <Button
            loading={isPending}
            onClick={() => mutate(record.id)}
          >
            Mark Paid
          </Button>
        </div>
      )}
    </Modal>
  );
}

// ─── PAGE ─────────────────────────────────

export default function FeesPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Fee | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['fees'],
    queryFn: getFees,
  });

  const fees = data?.list ?? [];

  const filtered = fees.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <Section>
        <FeeSummary />
      </Section>

      <Section className="mt-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <Card className="mt-4">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : filtered.length === 0 ? (
            <EmptyState title="No data" />
          ) : (
            filtered.map(f => (
              <div
                key={f.id}
                className="flex justify-between p-3 border-b border-white/10"
              >
                <span>{f.name}</span>

                <div className="flex gap-2 items-center">
                  <Badge variant={f.paid ? 'success' : 'warning'}>
                    {f.paid ? 'Paid' : 'Pending'}
                  </Badge>

                  {!f.paid && (
                    <button
                      onClick={() => setSelected(f)}
                      className="text-violet-400"
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </Card>
      </Section>

      <RecordPaymentModal
        record={selected}
        onClose={() => setSelected(null)}
      />
    </PageWrapper>
  );
}