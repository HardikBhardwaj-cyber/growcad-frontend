// components/ui/Section.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children:   ReactNode;
  title?:     string;
  subtitle?:  string;
  action?:    ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Section({
  children, title, subtitle, action, className, noPadding,
}: SectionProps) {
  return (
    <section className={cn(!noPadding && 'py-4', className)}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title    && (
              <h2 className="heading-2 text-[16px] text-white">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-1 text-[13px] text-white/40">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
