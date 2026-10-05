import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Weights } from '../../types/forecast';
import { sources } from '../../data/forecastOptions';
import { useTheme } from '../../contexts/ThemeContext';
import { chartStyles } from '../../utils/palette';
import { dominantSource, toPercents } from '../../utils/forecast';
import { cn } from '../../utils/cn';
import { SOURCE_BG } from '../forecast/WeightBar';

export function WeightDonut({ weights }: {weights: Weights;}) {
  const { palette } = useTheme();
  const s = chartStyles(palette);
  const p = toPercents(weights);
  const data = sources.map((src) => ({ id: src.id, name: src.label, value: p[src.id] }));
  const dom = sources.find((x) => x.id === dominantSource(weights)) ?? sources[0];

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,15rem)_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[15rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="96%" paddingAngle={2} stroke="none" isAnimationActive={false}>
              {data.map((d) =>
              <Cell key={d.id} fill={palette.sources[d.id]} />
              )}
            </Pie>
            <Tooltip {...s.tooltip} formatter={(v: number, n: string) => [`${v}%`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-muted">Largest share</span>
          <span className="text-lg font-semibold text-fg">{dom.label}</span>
        </div>
      </div>
      <ul className="space-y-4">
        {sources.map((src) =>
        <li key={src.id} className="flex items-baseline gap-3">
            <span className={cn('mt-1 h-3 w-3 shrink-0 self-start rounded-sm', SOURCE_BG[src.id])} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-fg">{src.label}</p>
              <p className="text-xs text-muted">{src.description}</p>
            </div>
            <span className="font-mono text-2xl font-medium tabular-nums text-fg">{p[src.id]}%</span>
          </li>
        )}
      </ul>
    </div>);

}