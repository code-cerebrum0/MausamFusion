import React from 'react';
import type { Variable } from '../../types/forecast';
import { sources } from '../../data/forecastOptions';
import { getVariable, scaleStops } from '../../utils/forecast';
import { cn } from '../../utils/cn';

export function ValueLegend({ variable, label }: {variable: Variable;label?: string;}) {
  const v = getVariable(variable);
  const stops = scaleStops(variable);
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted" aria-label={`Legend for ${v.label}`}>
      <span className="font-medium text-fg">{label ?? `${v.label} (${v.unit})`}</span>
      <ul className="flex flex-wrap items-center gap-2">
        {stops.map((s) =>
        <li key={s.value} className="flex items-center gap-1">
            <span className="h-2.5 w-4 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
            <span className="font-mono">{s.value}</span>
          </li>
        )}
      </ul>
    </div>);

}

export function WeightLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted">
      <span className="font-medium text-fg">Dominant source</span>
      {sources.map((s) =>
      <span key={s.id} className="flex items-center gap-1.5">
          <span className={cn('h-2.5 w-4 rounded-sm', s.id === 'nwp' ? 'bg-nwp' : s.id === 'ensemble' ? 'bg-ens' : 'bg-ai')} aria-hidden="true" />
          {s.label}
        </span>
      )}
      <span>· stronger colour = larger weight</span>
    </div>);

}