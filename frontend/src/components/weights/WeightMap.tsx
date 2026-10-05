import React, { useMemo } from 'react';
import type { ForecastContext } from '../../types/forecast';
import { locations } from '../../data/forecastOptions';
import { useTheme } from '../../contexts/ThemeContext';
import { hexToRgb } from '../../utils/palette';
import { cellCenter, dominantSource, toPercents, weightField } from '../../utils/forecast';
import { FieldGrid } from '../forecast/FieldGrid';
import { WeightLegend } from '../forecast/MapLegend';

interface WeightMapProps {
  ctx: ForecastContext;
  onSelectLocation: (id: string) => void;
}

export function WeightMap({ ctx, onSelectLocation }: WeightMapProps) {
  const { palette } = useTheme();
  const wf = useMemo(() => weightField(ctx), [ctx]);
  const fills = useMemo(
    () =>
    wf.map((row) =>
    row.map((w) => {
      const d = dominantSource(w);
      const [r, g, b] = hexToRgb(palette.sources[d]);
      const a = Math.min(0.95, 0.2 + (w[d] - 0.34) * 2.2);
      return `rgba(${r},${g},${b},${Math.max(0.15, a).toFixed(2)})`;
    })
    ),
    [wf, palette]
  );

  const tooltip = (r: number, c: number) => {
    const { lat, lon } = cellCenter(r, c);
    const p = toPercents(wf[r][c]);
    return {
      title: `${lat.toFixed(1)}°N, ${lon.toFixed(1)}°E`,
      lines: [
      { label: 'NWP', value: `${p.nwp}%` },
      { label: 'Ensemble', value: `${p.ensemble}%` },
      { label: 'AI', value: `${p.ai}%` }]

    };
  };

  return (
    <div>
      <FieldGrid
        fills={fills}
        tooltip={tooltip}
        markers={locations}
        selectedId={ctx.locationId}
        onSelect={onSelectLocation}
        ariaLabel="Spatial map of dominant forecast source weight per grid cell. Select a city marker to change location." />
      
      <div className="mt-3">
        <WeightLegend />
      </div>
    </div>);

}