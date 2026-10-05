import React from 'react';
import type { ForecastContext, ModelChoice, Variable } from '../../types/forecast';
import { leadTimes, locations, modelChoices, regimes, variables } from '../../data/forecastOptions';
import { leadLabel } from '../../utils/forecast';
import { cn } from '../../utils/cn';
import { Select } from '../ui/Select';

export type ControlField = 'location' | 'variable' | 'date' | 'lead' | 'model' | 'regime';

interface ForecastControlsProps {
  ctx: ForecastContext;
  onChange: (patch: Partial<ForecastContext>) => void;
  fields?: ControlField[];
  idPrefix: string;
  className?: string;
}

const ALL: ControlField[] = ['location', 'variable', 'date', 'lead', 'model', 'regime'];

export function ForecastControls({ ctx, onChange, fields = ALL, idPrefix, className }: ForecastControlsProps) {
  const has = (f: ControlField) => fields.includes(f);
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 min-[400px]:grid-cols-2',
        fields.length >= 6 ? 'md:grid-cols-3 xl:grid-cols-6' : 'md:grid-cols-4',
        className
      )}>
      
      {has('location') &&
      <Select
        id={`${idPrefix}-location`}
        label="Location"
        value={ctx.locationId}
        onChange={(v) => onChange({ locationId: v })}
        options={locations.map((l) => ({ value: l.id, label: l.name }))} />

      }
      {has('variable') &&
      <Select
        id={`${idPrefix}-variable`}
        label="Variable"
        value={ctx.variable}
        onChange={(v) => onChange({ variable: v as Variable })}
        options={variables.map((v) => ({ value: v.id, label: v.label }))} />

      }
      {has('date') &&
      <div className="min-w-0">
          <label htmlFor={`${idPrefix}-date`} className="mb-1.5 block text-xs font-medium text-muted">
            Forecast date (00 UTC)
          </label>
          <input
          id={`${idPrefix}-date`}
          type="date"
          value={ctx.date}
          onChange={(e) => e.target.value && onChange({ date: e.target.value })}
          className="input h-10 min-w-0" />
        
        </div>
      }
      {has('lead') &&
      <Select
        id={`${idPrefix}-lead`}
        label="Lead time"
        value={String(ctx.leadHours)}
        onChange={(v) => onChange({ leadHours: Number(v) })}
        options={leadTimes.map((h) => ({ value: String(h), label: leadLabel(h) }))} />

      }
      {has('model') &&
      <Select
        id={`${idPrefix}-model`}
        label="Model"
        value={ctx.model}
        onChange={(v) => onChange({ model: v as ModelChoice })}
        options={modelChoices} />

      }
      {has('regime') &&
      <Select
        id={`${idPrefix}-regime`}
        label="Weather regime"
        value={ctx.regimeId}
        onChange={(v) => onChange({ regimeId: v })}
        options={regimes.map((r) => ({ value: r.id, label: r.label }))} />

      }
    </div>);

}