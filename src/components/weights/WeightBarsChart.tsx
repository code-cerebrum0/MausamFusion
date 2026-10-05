import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Weights } from '../../types/forecast';
import { fixedGlobalWeights, sources } from '../../data/forecastOptions';
import { useTheme } from '../../contexts/ThemeContext';
import { chartStyles } from '../../utils/palette';
import { toPercents } from '../../utils/forecast';

export function WeightBarsChart({ weights }: {weights: Weights;}) {
  const { palette } = useTheme();
  const s = chartStyles(palette);
  const p = toPercents(weights);
  const data = sources.map((src) => ({
    id: src.id,
    name: src.label,
    context: p[src.id],
    fixed: Math.round(fixedGlobalWeights[src.id] * 100)
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 4 }} barGap={4}>
        <CartesianGrid stroke={s.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} unit="%" tick={s.tick} stroke={s.grid} />
        <YAxis type="category" dataKey="name" tick={s.tick} stroke={s.grid} width={68} />
        <Tooltip {...s.tooltip} cursor={{ fill: palette.surface2 }} formatter={(v: number, n: string) => [`${v}%`, n]} />
        <ReferenceLine x={33.3} stroke={palette.muted} strokeDasharray="4 4" label={{ value: 'equal', fill: palette.muted, fontSize: 10, position: 'top' }} />
        <Bar dataKey="context" name="This context" radius={[0, 6, 6, 0]} barSize={14} isAnimationActive={false}>
          {data.map((d) =>
          <Cell key={d.id} fill={palette.sources[d.id]} />
          )}
        </Bar>
        <Bar dataKey="fixed" name="Fixed global" fill={palette.muted} fillOpacity={0.35} radius={[0, 6, 6, 0]} barSize={8} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>);

}