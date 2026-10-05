import React, { useMemo } from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { hashString } from '../../utils/random';
import { formatDate } from '../../utils/forecast';
import { CopyButton } from '../ui/CopyButton';
import { DemoBadge } from '../ui/DemoBadge';

interface VerificationTimelineProps {
  filterKey: string;
  endDate: string;
  periodLabel: string;
  samples: number;
}

export function VerificationTimeline({ filterKey, endDate, periodLabel, samples }: VerificationTimelineProps) {
  const records = useMemo(() => {
    const end = new Date(`${endDate}T00:00:00Z`).getTime();
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(end - i * 14 * 86400000).toISOString().slice(0, 10);
      const id = `ver_${hashString(`${filterKey}|${d}`).toString(16).slice(0, 8)}`;
      return { id, date: d, config: i < 2 ? 'cfg-7f2a' : 'cfg-61c0', code: i < 3 ? 'mf-core 0.1.3' : 'mf-core 0.1.2' };
    });
  }, [filterKey, endDate]);

  return (
    <section id="timeline" className="panel scroll-mt-24 p-5" aria-labelledby="timeline-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="timeline-title" className="text-sm font-semibold text-fg">
            Verification timeline
          </h3>
          <p className="mt-0.5 text-xs text-muted">Each run writes a reproducible record: data window, configuration and code version.</p>
        </div>
        <DemoBadge label="Example records" />
      </div>
      <ol className="relative mt-5 space-y-5 border-l border-line pl-5">
        {records.map((r) =>
        <li key={r.id} className="relative">
            <CheckCircle2Icon className="absolute -left-[1.72rem] top-0.5 h-4 w-4 rounded-full bg-surface text-success" aria-hidden="true" />
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">
                  <time dateTime={r.date}>{formatDate(r.date)}</time> · {periodLabel}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  {r.id} · {r.config} · {r.code} · {samples} samples
                </p>
              </div>
              <CopyButton text={r.id} label="Copy ID" />
            </div>
          </li>
        )}
      </ol>
    </section>);

}