import React, { useMemo, useState } from 'react';
import type { ForecastContext } from '../../types/forecast';
import { locations, modelChoices } from '../../data/forecastOptions';
import {
  GRID,
  SOURCE_IDS,
  cellCenter,
  colorScale,
  fieldFor,
  formatValue,
  getVariable,
  leadLabel,
  sourceField,
  spreadColor,
  spreadField,
  validTime } from
'../../utils/forecast';
import { cn } from '../../utils/cn';
import { DemoBadge } from '../ui/DemoBadge';
import { Skeleton } from '../ui/Skeleton';
import { FieldGrid } from './FieldGrid';
import { ValueLegend } from './MapLegend';

interface ForecastMapProps {
  ctx: ForecastContext;
  loading: boolean;
  onSelectLocation: (id: string) => void;
}

export function ForecastMap({ ctx, loading, onSelectLocation }: ForecastMapProps) {
  const [mode, setMode] = useState<'field' | 'spread'>('field');
  const variable = getVariable(ctx.variable);
  const modelLabel = modelChoices.find((m) => m.value === ctx.model)?.label ?? '';

  const data = useMemo(() => {
    const field = fieldFor(ctx);
    const spread = spreadField(ctx);
    const src = SOURCE_IDS.map((s) => sourceField(ctx, s));
    return { field, spread, src };
  }, [ctx]);

  const fills = useMemo(
    () =>
    mode === 'field' ?
    data.field.map((row) => row.map((v) => colorScale(ctx.variable, v))) :
    data.spread.map((row) => row.map((v) => spreadColor(ctx.variable, v))),
    [data, mode, ctx.variable]
  );

  const tooltip = (r: number, c: number) => {
    const { lat, lon } = cellCenter(r, c);
    return {
      title: `${lat.toFixed(1)}°N, ${lon.toFixed(1)}°E`,
      lines: [
      { label: ctx.model === 'blend' ? 'Blend' : modelLabel, value: formatValue(ctx.variable, data.field[r][c]) },
      { label: 'NWP', value: formatValue(ctx.variable, data.src[0][r][c]) },
      { label: 'Ensemble', value: formatValue(ctx.variable, data.src[1][r][c]) },
      { label: 'AI', value: formatValue(ctx.variable, data.src[2][r][c]) },
      { label: 'Spread', value: formatValue(ctx.variable, data.spread[r][c]) }]

    };
  };

  return (
    <section className="panel min-w-0 p-4 sm:p-5" aria-labelledby="map-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="map-title" className="text-base font-semibold text-fg">
            {variable.long} · {modelLabel}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Valid {validTime(ctx.date, ctx.leadHours)} · lead {leadLabel(ctx.leadHours)} · {GRID.cols}×{GRID.rows} schematic 1° grid
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Map layer" className="flex rounded-lg border border-line bg-surface2 p-0.5">
            {(['field', 'spread'] as const).map((m) =>
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-[background-color,color] duration-150',
                mode === m ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'
              )}>
              
                {m === 'field' ? 'Forecast field' : 'Inter-model spread'}
              </button>
            )}
          </div>
          <DemoBadge />
        </div>
      </div>

      <div className="mt-4">
        {loading ?
        <Skeleton className="aspect-[636/502] w-full" /> :

        <FieldGrid
          fills={fills}
          tooltip={tooltip}
          markers={locations}
          selectedId={ctx.locationId}
          onSelect={onSelectLocation}
          ariaLabel={`${variable.label} ${mode === 'field' ? 'forecast field' : 'inter-model spread'} map. Select a city marker to update the location forecast.`} />

        }
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {mode === 'field' ?
        <ValueLegend variable={ctx.variable} /> :

        <div className="flex items-center gap-2 text-[11px] text-muted">
            <span className="font-medium text-fg">Spread</span>
            <span>Low</span>
            <span className="flex">
              {[0.1, 0.3, 0.5, 0.7, 0.95].map((a) =>
            <span key={a} className="h-2.5 w-5" style={{ background: `rgba(245,158,66,${a})` }} aria-hidden="true" />
            )}
            </span>
            <span>High</span>
          </div>
        }
        <p className="text-[11px] text-muted">Hover a cell for values · select a marker to change location</p>
      </div>
    </section>);

}