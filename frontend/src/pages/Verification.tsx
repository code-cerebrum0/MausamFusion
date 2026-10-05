import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RotateCcwIcon } from 'lucide-react';
import type { MethodId, Variable } from '../types/forecast';
import { comparisonMethods, evaluationPeriods, leadTimes, regimes, regions, seasons, variables } from '../data/forecastOptions';
import { useTheme } from '../contexts/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { chartStyles } from '../utils/palette';
import { getVariable, leadLabel, todayISO } from '../utils/forecast';
import { METHOD_IDS, fmt, runDemoVerification } from '../utils/demoVerification';
import { rollingMae } from '../utils/verification';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Select } from '../components/ui/Select';
import { Notice } from '../components/ui/Notice';
import { ChartFrame } from '../components/ui/ChartFrame';
import { Button } from '../components/ui/Button';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Skeleton } from '../components/ui/Skeleton';
import { CalibrationChart } from '../components/charts/CalibrationChart';
import { MethodMetrics } from '../components/verification/MethodMetrics';
import { VerificationTimeline } from '../components/verification/VerificationTimeline';

const DEFAULTS = { variable: 'temperature' as Variable, regionId: 'all', season: 'All seasons', lead: 24, regimeId: 'all', periodId: '90d' };
const methodLabel = (m: MethodId) => comparisonMethods.find((c) => c.id === m)?.label ?? m;

export function VerificationPage() {
  usePageMeta(
    'Verification · MausamFusion',
    'MausamFusion verification dashboard: MAE, RMSE, bias, skill score, CRPS, Brier score, reliability and event metrics with calibration curves and reproducible records, on synthetic demo data.'
  );
  const { palette } = useTheme();
  const s = chartStyles(palette);
  const [f, setF] = useState(DEFAULTS);
  const [focus, setFocus] = useState<MethodId>('fusion');
  const set = (patch: Partial<typeof DEFAULTS>) => setF((cur) => ({ ...cur, ...patch }));
  const key = JSON.stringify(f);
  const loading = useSimulatedLoad(key);
  const v = getVariable(f.variable);

  const effectiveRegime =
  f.regimeId !== 'all' ? f.regimeId : f.season !== 'All seasons' && regimes.find((r) => r.season === f.season)?.id || 'post-monsoon';

  const ver = useMemo(
    () =>
    runDemoVerification({
      variable: f.variable,
      leadHours: f.lead,
      regimeId: effectiveRegime,
      regionId: f.regionId,
      endDate: todayISO(),
      periodId: f.periodId,
      extra: f.season
    }),
    [f, effectiveRegime]
  );

  const errorData = METHOD_IDS.map((m) => ({ name: methodLabel(m), mae: round(ver.metrics[m].mae), rmse: round(ver.metrics[m].rmse) }));
  const skillTime = useMemo(() => {
    const seg = 6;
    const lines = Object.fromEntries(METHOD_IDS.map((m) => [m, rollingMae(ver.methods.forecasts[m], ver.series.truth, ver.series.trainEnd, seg)]));
    const evalDates = ver.series.dates.slice(ver.series.trainEnd);
    return Array.from({ length: seg }, (_, k) => {
      const row: Record<string, number | string> = { seg: evalDates[Math.min(evalDates.length - 1, Math.floor(k * evalDates.length / seg))].slice(5) };
      METHOD_IDS.forEach((m) => {
        row[m] = round(lines[m][k]);
      });
      return row;
    });
  }, [ver]);

  const fm = ver.metrics[focus];
  const groups = [
  {
    title: 'Continuous',
    items: [
    { label: 'MAE', value: fmt(fm.mae), unit: v.unit },
    { label: 'RMSE', value: fmt(fm.rmse), unit: v.unit },
    { label: 'Bias', value: fmt(fm.bias), unit: v.unit },
    { label: 'Skill score', value: fmt(ver.skill[focus]), unit: 'vs equal-weight' }]

  },
  {
    title: 'Probabilistic',
    items: [
    { label: 'CRPS', value: fmt(fm.crps), unit: v.unit },
    { label: 'Brier score', value: fmt(fm.brier, 3), unit: '' },
    { label: 'Reliability', value: fmt(fm.reliability, 3), unit: 'Brier component' }]

  },
  {
    title: 'Event',
    items: [
    { label: 'Precision', value: fmt(fm.precision), unit: '' },
    { label: 'Recall', value: fmt(fm.recall), unit: '' },
    { label: 'F1', value: fmt(fm.f1), unit: '' }]

  }];


  return (
    <div className="container-page space-y-6 py-10 sm:py-14">
      <SectionHeading
        as="h1"
        title="Verification"
        description="Every blended forecast is scored against observations once they arrive. Filter the evaluation to see how results are reported."
        actions={
        <Button variant="secondary" size="sm" onClick={() => setF(DEFAULTS)}>
            <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
            Reset filters
          </Button>
        } />
      


      <div className="panel p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <Select id="v-var" label="Variable" value={f.variable} onChange={(x) => set({ variable: x as Variable })} options={variables.map((x) => ({ value: x.id, label: x.label }))} />
          <Select id="v-region" label="Region" value={f.regionId} onChange={(x) => set({ regionId: x })} options={regions.map((r) => ({ value: r.id, label: r.label }))} />
          <Select id="v-season" label="Season" value={f.season} onChange={(x) => set({ season: x })} options={seasons.map((x) => ({ value: x, label: x }))} />
          <Select id="v-lead" label="Lead time" value={String(f.lead)} onChange={(x) => set({ lead: Number(x) })} options={leadTimes.map((h) => ({ value: String(h), label: leadLabel(h) }))} />
          <Select
            id="v-regime"
            label="Weather regime"
            value={f.regimeId}
            onChange={(x) => set({ regimeId: x })}
            options={[{ value: 'all', label: 'All regimes' }, ...regimes.map((r) => ({ value: r.id, label: r.label }))]} />
          
          <Select id="v-period" label="Evaluation period" value={f.periodId} onChange={(x) => set({ periodId: x })} options={evaluationPeriods.map((p) => ({ value: p.id, label: p.label }))} />
        </div>
      </div>

      <section className="panel" aria-labelledby="focus-title" aria-busy={loading}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id="focus-title" className="text-base font-semibold text-fg">
              {methodLabel(focus)}
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {v.long} · {ver.region.label} · {leadLabel(f.lead)} · {ver.period.label} · event threshold ≥ {ver.threshold.toFixed(1)} {v.unit} (upper quintile)
            </p>
          </div>
          <DemoBadge />
        </div>
        {loading ?
        <div className="p-5">
            <Skeleton className="h-28 w-full" />
          </div> :

        <div className="grid divide-y divide-line md:grid-cols-[1.4fr_1fr_1fr] md:divide-x md:divide-y-0">
            {groups.map((g) =>
          <div key={g.title} className="p-5">
                <p className="text-xs font-medium text-muted">{g.title}</p>
                <dl className="mt-3 grid grid-cols-2 gap-4">
                  {g.items.map((it) =>
              <div key={it.label} className="min-w-0">
                      <dt className="text-xs text-muted">{it.label}</dt>
                      <dd className="mt-0.5 font-mono text-2xl tabular-nums text-fg">{it.value}</dd>
                      {it.unit && <dd className="text-[11px] text-muted">{it.unit}</dd>}
                    </div>
              )}
                </dl>
              </div>
          )}
          </div>
        }
      </section>

      <section className="panel overflow-hidden" aria-labelledby="compare-title">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
          <div>
            <h2 id="compare-title" className="text-base font-semibold text-fg">
              Model comparison
            </h2>
            <p className="mt-0.5 text-xs text-muted">Select a method to focus it above. Skill score is relative to the equal-weight mean.</p>
          </div>
        </div>
        {loading ?
        <div className="p-5">
            <Skeleton className="h-56 w-full" />
          </div> :

        <MethodMetrics metrics={ver.metrics} skill={ver.skill} focus={focus} onFocus={setFocus} />
        }
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartFrame title="Error comparison" subtitle={`MAE and RMSE (${v.unit})`} loading={loading} height={260}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={errorData} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
              <CartesianGrid stroke={s.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ ...s.tick, fontSize: 10 }} stroke={s.grid} interval={0} tickFormatter={(x: string) => x.split(' ')[0]} />
              <YAxis tick={s.tick} stroke={s.grid} />
              <Tooltip {...s.tooltip} cursor={{ fill: palette.surface2 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="mae" name="MAE" fill={palette.accent} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="rmse" name="RMSE" fill={palette.muted} fillOpacity={0.6} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame title="Skill over time" subtitle={`Rolling MAE (${v.unit}) across the evaluation window — lower is better`} loading={loading} height={260}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={skillTime} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
              <CartesianGrid stroke={s.grid} strokeDasharray="3 3" />
              <XAxis dataKey="seg" tick={s.tick} stroke={s.grid} />
              <YAxis tick={s.tick} stroke={s.grid} />
              <Tooltip {...s.tooltip} />
              {METHOD_IDS.map((m) =>
              <Line
                key={m}
                dataKey={m}
                name={methodLabel(m)}
                stroke={palette.methods[m]}
                strokeWidth={m === focus ? 2.5 : 1.25}
                strokeOpacity={m === focus ? 1 : 0.6}
                dot={false}
                isAnimationActive={false} />

              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <ChartFrame
          id="calibration"
          title="Calibration curve"
          subtitle={`${methodLabel(focus)} vs equal-weight mean · dashed diagonal = perfect calibration`}
          loading={loading}
          height={260}
          className="scroll-mt-24">
          
          <CalibrationChart
            height={260}
            series={[
            { id: focus, label: methodLabel(focus), color: palette.methods[focus], bins: ver.metrics[focus].bins },
            ...(focus !== 'equal' ? [{ id: 'equal', label: 'Equal-weight mean', color: palette.methods.equal, bins: ver.metrics.equal.bins }] : [])]
            } />
          
        </ChartFrame>
        <VerificationTimeline filterKey={key} endDate={todayISO()} periodLabel={ver.period.label} samples={ver.series.truth.length - ver.series.trainEnd} />
      </div>
    </div>);

}

function round(x: number) {
  return Math.round(x * 100) / 100;
}