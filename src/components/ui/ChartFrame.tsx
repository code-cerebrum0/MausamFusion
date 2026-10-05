import React from 'react';
import { cn } from '../../utils/cn';
import { DemoBadge } from './DemoBadge';
import { Skeleton } from './Skeleton';

interface ChartFrameProps {
  title: string;
  subtitle?: string;
  demo?: boolean;
  loading?: boolean;
  height?: number;
  actions?: React.ReactNode;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export function ChartFrame({ title, subtitle, demo = true, loading, height = 260, actions, className, id, children }: ChartFrameProps) {
  return (
    <section id={id} className={cn('panel flex min-w-0 flex-col p-4 sm:p-5', className)} aria-label={title}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {demo && <DemoBadge />}
        </div>
      </div>
      <div className="min-w-0 flex-1" style={{ minHeight: height }}>
        {loading ?
        <div style={{ height }}>
            <Skeleton className="h-full w-full" />
          </div> :

        children
        }
      </div>
    </section>);

}