import React, { useMemo } from "react";
import { AlertTriangleIcon, CloudRainIcon, ThermometerIcon, WindIcon, BoxIcon } from "lucide-react";
import { ForecastContext, Variable } from "../../types/forecast";
import { extremeEvents, variables } from "../../data/forecastOptions";
import { confidenceLabel, exceedanceProbability, formatValue, getLocation, leadLabel, pointForecast, riskStatus, validTime, weightConfidence } from "../../utils/forecast";
import { cn } from "../../utils/cn";
import { Skeleton } from "../ui/Skeleton";
import { DemoBadge } from "../ui/DemoBadge";
import { WeightBar } from "./WeightBar";
import { RiskPill } from "./RiskPill";
const ICONS: Record<Variable, BoxIcon> = {
  temperature: ThermometerIcon,
  rainfall: CloudRainIcon,
  wind: WindIcon
};
interface LocationSummaryProps {
  ctx: ForecastContext;
  loading: boolean;
  onVariable: (v: Variable) => void;
}
export function LocationSummary({
  ctx,
  loading,
  onVariable
}: LocationSummaryProps) {
  const loc = getLocation(ctx.locationId);
  const forecasts = useMemo(() => variables.map((v) => pointForecast(ctx, v.id)), [ctx]);
  const selected = forecasts.find((f) => f.variable === ctx.variable) ?? forecasts[0];
  const conf = weightConfidence(selected);
  const topEvent = useMemo(() => {
    const scored = extremeEvents.map((e) => {
      const pf = forecasts.find((f) => f.variable === e.variable) ?? forecasts[0];
      return {
        e,
        p: exceedanceProbability(pf.blend, pf.spread, e.threshold, e.variable)
      };
    });
    return scored.sort((a, b) => b.p - a.p)[0];
  }, [forecasts]);
  return <section className="panel flex min-w-0 flex-col" aria-labelledby="loc-title" aria-busy={loading}>
      <div className="flex items-start justify-between gap-3 border-b border-line p-4 sm:p-5">
        <div className="min-w-0">
          <h2 id="loc-title" className="text-base font-semibold text-fg">
            {loc.name}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Valid {validTime(ctx.date, ctx.leadHours)} · lead {leadLabel(ctx.leadHours)}
          </p>
        </div>
        <DemoBadge />
      </div>

      {loading ? <div className="space-y-3 p-5">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
        </div> : <>
          <ul className="divide-y divide-line">
            {forecasts.map((f) => {
          const v = variables.find((x) => x.id === f.variable) ?? variables[0];
          const Icon = ICONS[f.variable];
          const isSel = f.variable === ctx.variable;
          return <li key={f.variable}>
                  <button type="button" onClick={() => onVariable(f.variable)} aria-pressed={isSel} className={cn('w-full px-4 text-left transition-[background-color] duration-150 sm:px-5', isSel ? 'bg-accent/5 py-5' : 'py-3 hover:bg-surface2/60')}>
                    <div className="flex items-center gap-3">
                      <Icon className={cn('h-4 w-4 shrink-0', isSel ? 'text-accent' : 'text-muted')} aria-hidden="true" />
                      <span className={cn('text-sm', isSel ? 'font-medium text-fg' : 'text-muted')}>{v.label}</span>
                      <span className={cn('ml-auto font-mono tabular-nums text-fg', isSel ? 'text-3xl font-medium' : 'text-sm')}>
                        {formatValue(f.variable, f.blend)}
                      </span>
                    </div>
                    {isSel && <div className="mt-4 pl-7">
                        <p className="mb-2 text-xs text-muted">Model contribution</p>
                        <WeightBar weights={f.weights} />
                      </div>}
                  </button>
                </li>;
        })}
          </ul>

          <div className="grid grid-cols-2 border-t border-line">
            <div className="border-r border-line p-4 sm:p-5">
              <p className="text-xs text-muted">Uncertainty</p>
              <p className="mt-1 font-mono text-lg tabular-nums text-fg">± {formatValue(selected.variable, selected.spread / 2)}</p>
              <p className="mt-1 text-xs text-muted">
                Range {formatValue(selected.variable, selected.min)} – {formatValue(selected.variable, selected.max)}
              </p>
              <p className="mt-2 text-xs text-muted">
                Weight confidence <span className="font-medium text-fg">{confidenceLabel(conf)}</span>
              </p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <AlertTriangleIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Extreme-weather indicator
              </p>
              <p className="mt-1 text-sm font-medium text-fg">{topEvent.e.label}</p>
              <p className="mt-0.5 font-mono text-lg tabular-nums text-fg">{Math.round(topEvent.p * 100)}%</p>
              <RiskPill status={riskStatus(topEvent.p)} className="mt-2" />
            </div>
          </div>
        </>}
    </section>;
}