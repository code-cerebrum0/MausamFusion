import React, { useMemo } from 'react';
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ForecastContext } from '../../types/forecast';
import { useTheme } from '../../contexts/ThemeContext';
import { chartStyles } from '../../utils/palette';
import { confidenceLabel, getLocation, getVariable, leadSeries, pointForecast, weightConfidence } from '../../utils/forecast';
import { fmt, runDemoVerification } from '../../utils/demoVerification';
import { ChartFrame } from '../ui/ChartFrame';
import { SectionHeading } from '../ui/SectionHeading';
import { DemoBadge } from '../ui/DemoBadge';
import { CalibrationChart } from '../charts/CalibrationChart';
import { ConfidenceGauge } from './ConfidenceGauge';

export function UncertaintySection({ ctx, loading }: {ctx: ForecastContext;loading: boolean;}) {
  const { palette } = useTheme();
  const s = chartStyles(palette);
  const variable = getVariable(ctx.variable);
  const series = useMemo(() => leadSeries(ctx), [ctx]);
  const pf = useMemo(() => pointForecast(ctx), [ctx]);
  const conf = weightConfidence(pf);
  const ver = useMemo(
    () =>
    runDemoVerification({
      variable: ctx.variable,
      leadHours: ctx.leadHours,
      regimeId: ctx.regimeId,
      regionId: getLocation(ctx.locationId).region,
      endDate: ctx.date,
      periodId: '90d'
    }),
    [ctx]
  );
  const fusion = ver.metrics.fusion;

  return (
    <section id="uncertainty" className="scroll-mt-24" aria-labelledby="uncertainty-title">
      <SectionHeading titleId="uncertainty-title" title="Uncertainty" description="Two different questions, answered separately." />
      <dl className="mt-6 grid gap-6 border-y border-line py-6 md:grid-cols-2 md:gap-10">
        <div>
          <dt className="font-medium text-fg">Forecast uncertainty</dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted">
            Uncertainty in the resulting forecast — how far the true value may plausibly fall from the blended value. Estimated from inter-model
            spread and calibrated against past residuals.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-fg">Weight confidence</dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted">
            Confidence in the generated model contributions — how settled the gating model is about the mix. Lower when sources disagree strongly
            or skill memory is sparse.
          </dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartFrame
          title="Inter-model spread by lead time"
          subtitle={`${variable.long} (${variable.unit}) at ${getLocation(ctx.locationId).name}`}
          loading={loading}
          height={280}
          className="lg:col-span-2">
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
              <CartesianGrid stroke={s.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={s.tick} stroke={s.grid} />
              <YAxis tick={s.tick} stroke={s.grid} width={44} />
              <Tooltip {...s.tooltip} formatter={(v: number | number[]) => Array.isArray(v) ? `${v[0]} – ${v[1]}` : v} />
              <Legend wrapperStyle={{ fontSize: 11, color: palette.muted }} />
              <Area type="monotone" dataKey="range" name="Source range" fill={palette.accent} fillOpacity={0.14} stroke="none" isAnimationActive={false} />
              <Line type="monotone" dataKey="nwp" name="NWP" stroke={palette.sources.nwp} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="ensemble" name="Ensemble" stroke={palette.sources.ensemble} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="ai" name="AI" stroke={palette.sources.ai} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="blend" name="Blend" stroke={palette.fg} strokeWidth={2.5} dot={{ r: 2.5 }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartFrame>

        <section className="panel flex flex-col p-5" aria-label="Weight confidence">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-fg">Weight confidence</h3>
            <DemoBadge />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center py-6">
            <ConfidenceGauge value={conf} label={confidenceLabel(conf)} />
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Derived from source disagreement at this point ({variable.unit} range {pf.spread.toFixed(1)}). A wide range lowers confidence in the
            mix even when the blended value looks reasonable.
          </p>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <ChartFrame
          title="Calibration (reliability diagram)"
          subtitle="Observed frequency vs forecast probability for an upper-quintile event, synthetic 90-day series"
          loading={loading}
          height={240}>
          
          <CalibrationChart series={[{ id: 'fusion', label: 'MausamFusion', color: palette.accent, bins: fusion.bins }]} />
        </ChartFrame>
        <section className="panel p-5" aria-label="Probabilistic scores">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-fg">Probabilistic scores</h3>
            <DemoBadge label="" />
          </div>
          <dl className="mt-4 divide-y divide-line">
            <div className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-sm font-medium text-fg">CRPS</dt>
                <dd className="font-mono text-lg tabular-nums text-fg">
                  {fmt(fusion.crps)} <span className="text-xs text-muted">{variable.unit}</span>
                </dd>
              </div>
              <p className="mt-1 text-xs text-muted">Continuous ranked probability score of the predictive distribution. Lower is better.</p>
            </div>
            <div className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-sm font-medium text-fg">Brier score</dt>
                <dd className="font-mono text-lg tabular-nums text-fg">{fmt(fusion.brier, 3)}</dd>
              </div>
              <p className="mt-1 text-xs text-muted">Mean squared error of event probabilities (0 = perfect). Lower is better.</p>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Computed in your browser on a synthetic series to show how scores are presented. These are not actual scores of any forecast system.
          </p>
        </section>
      </div>
    </section>);

}