import type { MethodId, Variable } from '../types/forecast';
import { evaluationPeriods, regions } from '../data/forecastOptions';
import { cellWeights } from './forecast';
import { percentile } from './stats';
import { computeMetrics, methodForecasts, skillScore, syntheticSeries, type MetricSet } from './verification';

export const METHOD_IDS: MethodId[] = ['best', 'equal', 'fixed', 'skill', 'fusion'];

export interface DemoVerificationInput {
  variable: Variable;
  leadHours: number;
  regimeId: string;
  regionId: string;
  endDate: string;
  periodId: string;
  extra?: string;
}

export function runDemoVerification(o: DemoVerificationInput) {
  const period = evaluationPeriods.find((p) => p.id === o.periodId) ?? evaluationPeriods[0];
  const region = regions.find((r) => r.id === o.regionId) ?? regions[0];
  const ctx = { locationId: 'delhi', variable: o.variable, date: o.endDate, leadHours: o.leadHours, model: 'blend' as const, regimeId: o.regimeId };
  const baseWeights = cellWeights(ctx, region.lat, region.lon);
  const series = syntheticSeries({
    key: JSON.stringify(o),
    n: period.points,
    variable: o.variable,
    leadHours: o.leadHours,
    regimeId: o.regimeId,
    endDate: o.endDate,
    spanDays: period.days,
    baseWeights
  });
  const methods = methodForecasts(series);
  const threshold = percentile(series.truth.slice(series.trainEnd), 0.8);
  const metrics = {} as Record<MethodId, MetricSet>;
  METHOD_IDS.forEach((m) => {
    metrics[m] = computeMetrics(methods.forecasts[m], series.truth, series.spread, o.variable, threshold, series.trainEnd);
  });
  const skill = {} as Record<MethodId, number>;
  METHOD_IDS.forEach((m) => {
    skill[m] = skillScore(metrics[m], metrics.equal);
  });
  return { series, methods, metrics, skill, threshold, baseWeights, period, region };
}

export function fmt(v: number | null | undefined, digits = 2): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return v.toFixed(digits);
}