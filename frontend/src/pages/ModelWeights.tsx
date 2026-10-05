import React, { useCallback, useMemo, useState } from 'react';
import type { ForecastContext } from '../types/forecast';
import { weightFactors } from '../data/weightFactors';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { computeWeights, defaultContext, getLocation, getVariable, isDefaultContext, leadLabel } from '../utils/forecast';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ChartFrame } from '../components/ui/ChartFrame';
import { Notice } from '../components/ui/Notice';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Skeleton } from '../components/ui/Skeleton';
import { ForecastControls } from '../components/forecast/ForecastControls';
import { WeightDonut } from '../components/weights/WeightDonut';
import { WeightBarsChart } from '../components/weights/WeightBarsChart';
import { WeightTimeline } from '../components/weights/WeightTimeline';
import { WeightMap } from '../components/weights/WeightMap';
import { ComparisonDashboard } from '../components/weights/ComparisonDashboard';

export function ModelWeightsPage() {
  usePageMeta(
    'Model Weights · MausamFusion',
    'How MausamFusion assigns context-dependent weights to NWP, ensemble and AI forecasts — donut, bar, lead-time timeline and spatial weight map with illustrative values.'
  );
  const [ctx, setCtx] = useState<ForecastContext>(defaultContext);
  const update = useCallback((patch: Partial<ForecastContext>) => setCtx((c) => ({ ...c, ...patch })), []);
  const loading = useSimulatedLoad(JSON.stringify(ctx));
  const weights = useMemo(() => computeWeights(ctx), [ctx]);
  const loc = getLocation(ctx.locationId);
  const contextLine = `${loc.name} · ${getVariable(ctx.variable).label} · ${leadLabel(ctx.leadHours)}`;

  return (
    <div className="container-page space-y-16 py-10 sm:py-14">
      <div>
        <SectionHeading
          as="h1"
          title="Model weights"
          description="For each forecast context, the adaptive gating model assigns NWP, ensemble and AI a share of the blend. The shares always sum to 100%." />
        


        <div className="panel mt-6 p-4 sm:p-5">
          <ForecastControls ctx={ctx} onChange={update} fields={['location', 'variable', 'lead', 'regime']} idPrefix="wt" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <section className="panel p-5 sm:p-6" aria-labelledby="donut-title">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 id="donut-title" className="text-base font-semibold text-fg">
                  Source weights
                </h2>
                <p className="mt-0.5 text-xs text-muted">{contextLine}</p>
              </div>
              <DemoBadge label={isDefaultContext(ctx) ? '' : 'Demo data'} />
            </div>
            <div className="mt-6">{loading ? <Skeleton className="h-60 w-full" /> : <WeightDonut weights={weights} />}</div>
          </section>
          <ChartFrame title="Weights vs fixed global weighting" subtitle="Coloured: this context · grey: one fixed mix for every context" loading={loading} height={240}>
            <WeightBarsChart weights={weights} />
          </ChartFrame>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ChartFrame title="Weights across lead time" subtitle={`${loc.name} · ${getVariable(ctx.variable).label}`} loading={loading} height={260}>
            <WeightTimeline ctx={ctx} />
          </ChartFrame>
          <ChartFrame title="Spatial weight map" subtitle={`Dominant source per cell · ${leadLabel(ctx.leadHours)}`} loading={loading} height={300}>
            <WeightMap ctx={ctx} onSelectLocation={(id) => update({ locationId: id })} />
          </ChartFrame>
        </div>
      </div>

      <section aria-labelledby="factors-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading
            titleId="factors-title"
            title="What the gating model considers"
            description="These factors form the context vector. The model learns how they relate to verified skill; it does not apply fixed rules." />
          
          <dl className="divide-y divide-line border-y border-line">
            {weightFactors.map((f) =>
            <div key={f.id} className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="text-sm font-medium text-fg">{f.title}</dt>
                <dd className="text-sm text-muted">{f.text}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <ComparisonDashboard />
    </div>);

}