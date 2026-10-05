import React, { useMemo } from 'react';
import type { ForecastContext, SourceId } from '../../types/forecast';
import { sources } from '../../data/forecastOptions';
import {
  confidenceLabel,
  disagreementLabel,
  formatDate,
  formatValue,
  getLocation,
  getRegime,
  leadLabel,
  pointForecast,
  weightConfidence } from
'../../utils/forecast';
import { rngFor } from '../../utils/random';
import { cn } from '../../utils/cn';
import { DemoBadge } from '../ui/DemoBadge';
import { Notice } from '../ui/Notice';
import { WeightBar, SOURCE_BG } from './WeightBar';

function skillIndex(key: string): Record<SourceId, number> {
  const rng = rngFor(key);
  return { nwp: 0.35 + rng() * 0.55, ensemble: 0.35 + rng() * 0.55, ai: 0.35 + rng() * 0.55 };
}

function SkillBars({ title, values }: {title: string;values: Record<SourceId, number>;}) {
  return (
    <div>
      <p className="text-sm font-medium text-fg">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {sources.map((s) =>
        <li key={s.id} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2 text-xs">
            <span className="text-muted">{s.label}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-surface2">
              <span className={cn('block h-full rounded-full', SOURCE_BG[s.id])} style={{ width: `${values[s.id] * 100}%` }} />
            </span>
            <span className="text-right font-mono tabular-nums text-fg">{values[s.id].toFixed(2)}</span>
          </li>
        )}
      </ul>
    </div>);

}

export function ExplainPanel({ ctx }: {ctx: ForecastContext;}) {
  const loc = getLocation(ctx.locationId);
  const regime = getRegime(ctx.regimeId);
  const pf = useMemo(() => pointForecast(ctx), [ctx]);
  const conf = weightConfidence(pf);
  const hist = useMemo(() => skillIndex(`hist|${ctx.locationId}|${ctx.variable}|${ctx.leadHours}|${ctx.regimeId}`), [ctx]);
  const recent = useMemo(() => skillIndex(`recent|${ctx.locationId}|${ctx.variable}|${ctx.leadHours}|${ctx.date}`), [ctx]);

  const factors = [
  { label: 'Location', value: `${loc.name}`, detail: `${loc.lat.toFixed(2)}°N, ${loc.lon.toFixed(2)}°E` },
  { label: 'Season', value: regime.season, detail: `Forecast issued ${formatDate(ctx.date)}, 00 UTC` },
  { label: 'Lead time', value: leadLabel(ctx.leadHours), detail: `${ctx.leadHours} hours from issue` },
  { label: 'Weather regime', value: regime.label, detail: regime.description },
  {
    label: 'Model disagreement',
    value: disagreementLabel(ctx.variable, pf.spread),
    detail: `Source range ${formatValue(ctx.variable, pf.spread)} at this point`
  }];


  return (
    <section id="explain" className="scroll-mt-24" aria-labelledby="explain-title">
      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id="explain-title" className="text-lg font-semibold text-fg">
              Why this forecast?
            </h2>
            <p className="mt-0.5 text-sm text-muted">The context the adaptive gating system used for the selected location and lead time.</p>
          </div>
          <DemoBadge />
        </div>
        <div className="grid lg:grid-cols-[1.3fr_1fr]">
          <dl className="divide-y divide-line">
            {factors.map((f) =>
            <div key={f.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd>
                  <p className="text-sm font-medium text-fg">{f.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{f.detail}</p>
                </dd>
              </div>
            )}
          </dl>
          <div className="space-y-6 border-t border-line p-5 lg:border-l lg:border-t-0">
            <SkillBars title="Historical skill (index)" values={hist} />
            <SkillBars title="Recent skill (index)" values={recent} />
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-fg">Generated weights</p>
                <p className="text-xs text-muted">Confidence: {confidenceLabel(conf)}</p>
              </div>
              <div className="mt-2">
                <WeightBar weights={pf.weights} />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-line p-4">
          <Notice title="">
            
          </Notice>
        </div>
      </div>
    </section>);

}