import React from 'react';
import { CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { chartStyles } from '../../utils/palette';
import type { ReliabilityBin } from '../../utils/verification';

interface CalibrationChartProps {
  series: {id: string;label: string;color: string;bins: ReliabilityBin[];}[];
  height?: number;
}

export function CalibrationChart({ series, height = 240 }: CalibrationChartProps) {
  const { palette } = useTheme();
  const s = chartStyles(palette);
  const hasData = series.some((x) => x.bins.length > 0);
  if (!hasData) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-line text-sm text-muted" style={{ height }}>
        Not enough events in this window to draw a calibration curve.
      </div>);

  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid stroke={s.grid} strokeDasharray="3 3" />
        <XAxis type="number" dataKey="forecast" domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} tick={s.tick} stroke={s.grid} />
        <YAxis type="number" domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} tick={s.tick} stroke={s.grid} />
        <ReferenceLine
          segment={[
          { x: 0, y: 0 },
          { x: 1, y: 1 }]
          }
          stroke={palette.muted}
          strokeDasharray="4 4"
          ifOverflow="extendDomain" />
        
        <Tooltip
          {...s.tooltip}
          formatter={(v: number, name: string) => [v.toFixed(2), name]}
          labelFormatter={(l: number) => `Forecast probability ${Number(l).toFixed(2)}`} />
        
        {series.map((x) =>
        <Line
          key={x.id}
          data={x.bins}
          dataKey="observed"
          name={`${x.label} observed frequency`}
          stroke={x.color}
          strokeWidth={2}
          dot={{ r: 3.5, fill: x.color }}
          isAnimationActive={false} />

        )}
      </ComposedChart>
    </ResponsiveContainer>);

}