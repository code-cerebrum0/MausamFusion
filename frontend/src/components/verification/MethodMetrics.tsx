import React from 'react';
import type { MethodId } from '../../types/forecast';
import { comparisonMethods } from '../../data/forecastOptions';
import { useTheme } from '../../contexts/ThemeContext';
import { fmt, METHOD_IDS } from '../../utils/demoVerification';
import type { MetricSet } from '../../utils/verification';
import { cn } from '../../utils/cn';

interface MethodMetricsProps {
  metrics: Record<MethodId, MetricSet>;
  skill: Record<MethodId, number>;
  focus: MethodId;
  onFocus: (m: MethodId) => void;
}

const COLUMNS: {key: string;label: string;get: (m: MetricSet, s: number) => string;}[] = [
{ key: 'mae', label: 'MAE', get: (m) => fmt(m.mae) },
{ key: 'rmse', label: 'RMSE', get: (m) => fmt(m.rmse) },
{ key: 'bias', label: 'Bias', get: (m) => fmt(m.bias) },
{ key: 'skill', label: 'Skill', get: (_, s) => fmt(s) },
{ key: 'crps', label: 'CRPS', get: (m) => fmt(m.crps) },
{ key: 'brier', label: 'Brier', get: (m) => fmt(m.brier, 3) },
{ key: 'rel', label: 'Reliab.', get: (m) => fmt(m.reliability, 3) },
{ key: 'precision', label: 'Precision', get: (m) => fmt(m.precision) },
{ key: 'recall', label: 'Recall', get: (m) => fmt(m.recall) },
{ key: 'f1', label: 'F1', get: (m) => fmt(m.f1) }];


const label = (m: MethodId) => comparisonMethods.find((c) => c.id === m)?.label ?? m;

export function MethodMetrics({ metrics, skill, focus, onFocus }: MethodMetricsProps) {
  const { palette } = useTheme();
  return (
    <>
      <div className="hidden lg:block">
        <table className="w-full table-fixed text-sm">
          <caption className="sr-only">Verification metrics by method (synthetic demo)</caption>
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th scope="col" className="w-[17%] py-2.5 pl-5 text-left font-medium">
                Method
              </th>
              {COLUMNS.map((c) =>
              <th key={c.key} scope="col" className="py-2.5 pr-3 text-right font-medium last:pr-5">
                  {c.label}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {METHOD_IDS.map((m) =>
            <tr
              key={m}
              onClick={() => onFocus(m)}
              className={cn('cursor-pointer transition-[background-color] duration-150', m === focus ? 'bg-accent/5' : 'hover:bg-surface2/60')}>
              
                <th scope="row" className="py-3 pl-5 text-left font-normal">
                  <button type="button" onClick={() => onFocus(m)} className="flex items-center gap-2 text-left text-fg" aria-pressed={m === focus}>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: palette.methods[m] }} aria-hidden="true" />
                    <span className={cn('truncate', m === focus && 'font-medium')}>{label(m)}</span>
                  </button>
                </th>
                {COLUMNS.map((c) =>
              <td key={c.key} className="py-3 pr-3 text-right font-mono tabular-nums text-fg last:pr-5">
                    {c.get(metrics[m], skill[m])}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-line lg:hidden">
        {METHOD_IDS.map((m) =>
        <li key={m} className={cn('p-4', m === focus && 'bg-accent/5')}>
            <button type="button" onClick={() => onFocus(m)} className="flex items-center gap-2 text-sm font-medium text-fg" aria-pressed={m === focus}>
              <span className="h-2 w-2 rounded-full" style={{ background: palette.methods[m] }} aria-hidden="true" />
              {label(m)}
            </button>
            <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2 min-[480px]:grid-cols-5">
              {COLUMNS.map((c) =>
            <div key={c.key} className="min-w-0">
                  <dt className="text-[11px] text-muted">{c.label}</dt>
                  <dd className="font-mono text-sm tabular-nums text-fg">{c.get(metrics[m], skill[m])}</dd>
                </div>
            )}
            </dl>
          </li>
        )}
      </ul>
    </>);

}