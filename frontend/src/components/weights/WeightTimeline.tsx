import React from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ForecastContext } from '../../types/forecast';
import { useTheme } from '../../contexts/ThemeContext';
import { chartStyles } from '../../utils/palette';
import { weightTimeline } from '../../utils/forecast';

export function WeightTimeline({ ctx }: {ctx: ForecastContext;}) {
  const { palette } = useTheme();
  const s = chartStyles(palette);
  const data = weightTimeline(ctx);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
        <CartesianGrid stroke={s.grid} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={s.tick} stroke={s.grid} />
        <YAxis domain={[0, 100]} unit="%" tick={s.tick} stroke={s.grid} />
        <Tooltip {...s.tooltip} formatter={(v: number, n: string) => [`${v}%`, n]} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" stackId="w" dataKey="nwp" name="NWP" stroke={palette.sources.nwp} fill={palette.sources.nwp} fillOpacity={0.75} isAnimationActive={false} />
        <Area type="monotone" stackId="w" dataKey="ensemble" name="Ensemble" stroke={palette.sources.ensemble} fill={palette.sources.ensemble} fillOpacity={0.75} isAnimationActive={false} />
        <Area type="monotone" stackId="w" dataKey="ai" name="AI" stroke={palette.sources.ai} fill={palette.sources.ai} fillOpacity={0.75} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>);

}