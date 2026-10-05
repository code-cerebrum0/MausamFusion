import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MethodId, Variable } from '../../types/forecast';
import { comparisonMethods, leadTimes, regions, variables } from '../../data/forecastOptions';
import { useTheme } from '../../contexts/ThemeContext';
import { useSimulatedLoad } from '../../hooks/useSimulatedLoad';
import { chartStyles } from '../../utils/palette';
import { cellWeights, getVariable, leadLabel, todayISO, toPercents } from '../../utils/forecast';
import { methodForecasts, syntheticSeries } from '../../utils/verification';
import { METHOD_IDS, fmt } from '../../utils/demoVerification';
import { mean } from '../../utils/stats';
import { cn } from '../../utils/cn';
import { Select } from '../ui/Select';
import { ChartFrame } from '../ui/ChartFrame';
import { Notice } from '../ui/Notice';
import { SectionHeading } from '../ui/SectionHeading';

export function ComparisonDashboard() {
  const { palette } = useTheme();
  const s = chartStyles(palette);
  const [variable, setVariable] = useState<Variable>('rainfall');
  const [regionId, setRegionId] = useState('west-coast');
  const [lead, setLead] = useState(72);
  const [date, setDate] = useState(todayISO());
  const [shown, setShown] = useState<MethodId[]>(['best', 'equal', 'fusion']);
  const loading = useSimulatedLoad(`${variable}|${regionId}|${lead}|${date}`);
  const v = getVariable(variable);

  const result = useMemo(() => {
    const region = regions.find((r) => r.id === regionId) ?? regions[0];
    const ctx = { locationId: 'delhi', variable, date, leadHours: lead, model: 'blend' as const, regimeId: 'monsoon-active' };
    const series = syntheticSeries({
      key: `cmp|${variable}|${regionId}|${lead}|${date}`,
      n: 21,
      variable,
      leadHours: lead,
      regimeId: 'monsoon-active',
      endDate: date,
      spanDays: 20,
      baseWeights: cellWeights(ctx, region.lat, region.lon)
    });
    const methods = methodForecasts(series);
    const from = series.trainEnd;
    const days = series.dates.slice(from).map((d, i) => {
      const t = from + i;
      const row: Record<string, number | string> = { date: d.slice(5), reference: round(series.truth[t]) };
      METHOD_IDS.forEach((m) => {
        row[m] = round(methods.forecasts[m][t]);
      });
      const p = toPercents(series.weights[t]);
      row.nwp = p.nwp;
      row.ensemble = p.ensemble;
      row.ai = p.ai;
      return row;
    });
    const errors = METHOD_IDS.map((m) => {
      const e = series.truth.slice(from).map((y, i) => methods.forecasts[m][from + i] - y);
      return {
        id: m,
        name: comparisonMethods.find((c) => c.id === m)?.label ?? m,
        mae: round(mean(e.map(Math.abs)), 2),
        rmse: round(Math.sqrt(mean(e.map((x) => x * x))), 2),
        bias: round(mean(e), 2)
      };
    });
    return { days, errors, bestSource: methods.bestSource, trainDays: from };
  }, [variable, regionId, lead, date]);

  const toggle = (m: MethodId) => setShown((cur) => cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]);

  return (
    <section id="comparison" className="scroll-mt-24" aria-labelledby="comparison-title">
      <SectionHeading
        titleId="comparison-title"
        title="Forecast comparison"
        description="Compare MausamFusion with four reference strategies on the same inputs: best individual model, equal-weight mean, fixed global weight and skill-based weighting." />
      
      <Notice tone="warn" className="mt-6">
        Every number here is computed on synthetic series in which each source’s error is drawn at random. Rankings change with the filters and do
        not indicate real-world performance of any method.
      </Notice>

      <div className="panel mt-4 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 md:grid-cols-4">
          <Select id="cmp-var" label="Variable" value={variable} onChange={(x) => setVariable(x as Variable)} options={variables.map((x) => ({ value: x.id, label: x.label }))} />
          <Select id="cmp-region" label="Region" value={regionId} onChange={setRegionId} options={regions.map((r) => ({ value: r.id, label: r.label }))} />
          <Select id="cmp-lead" label="Lead time" value={String(lead)} onChange={(x) => setLead(Number(x))} options={leadTimes.map((h) => ({ value: String(h), label: leadLabel(h) }))} />
          <div className="min-w-0">
            <label htmlFor="cmp-date" className="mb-1.5 block text-xs font-medium text-muted">
              End date
            </label>
            <input id="cmp-date" type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="input h-10" />
          </div>
        </div>
        <fieldset className="mt-4">
          <legend className="mb-2 text-xs font-medium text-muted">Methods on the value chart</legend>
          <div className="flex flex-wrap gap-2">
            {comparisonMethods.map((m) => {
              const on = shown.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(m.id)}
                  className={cn(
                    'inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-[background-color,border-color,color] duration-150',
                    on ? 'border-line bg-surface2 text-fg' : 'border-dashed border-line text-muted hover:text-fg'
                  )}>
                  
                  <span className="h-2 w-2 rounded-full" style={{ background: palette.methods[m.id], opacity: on ? 1 : 0.35 }} aria-hidden="true" />
                  {m.label}
                </button>);

            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartFrame
          title="Forecast value"
          subtitle={`${v.long} (${v.unit}) · lead ${leadLabel(lead)} · dashed line = synthetic reference`}
          loading={loading}
          height={300}
          className="lg:col-span-2">
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.days} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
              <CartesianGrid stroke={s.grid} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={s.tick} stroke={s.grid} />
              <YAxis tick={s.tick} stroke={s.grid} width={44} />
              <Tooltip {...s.tooltip} />
              <Line dataKey="reference" name="Reference" stroke={palette.fg} strokeDasharray="5 4" strokeWidth={2} dot={false} isAnimationActive={false} />
              {comparisonMethods.
              filter((m) => shown.includes(m.id)).
              map((m) =>
              <Line
                key={m.id}
                dataKey={m.id}
                name={m.label}
                stroke={palette.methods[m.id]}
                strokeWidth={m.id === 'fusion' ? 2.5 : 1.5}
                dot={false}
                isAnimationActive={false} />

              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Error" subtitle={`MAE and RMSE over ${result.days.length} evaluation days`} loading={loading} height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={result.errors} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={s.grid} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={s.tick} stroke={s.grid} />
              <YAxis type="category" dataKey="name" tick={{ ...s.tick, fontSize: 10 }} stroke={s.grid} width={92} />
              <Tooltip {...s.tooltip} cursor={{ fill: palette.surface2 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="mae" name="MAE" fill={palette.accent} radius={[0, 4, 4, 0]} barSize={8} isAnimationActive={false} />
              <Bar dataKey="rmse" name="RMSE" fill={palette.muted} fillOpacity={0.6} radius={[0, 4, 4, 0]} barSize={8} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <ChartFrame title="Model contribution" subtitle="MausamFusion weights for each day" loading={loading} height={240}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={result.days} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
              <CartesianGrid stroke={s.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={s.tick} stroke={s.grid} />
              <YAxis domain={[0, 100]} unit="%" tick={s.tick} stroke={s.grid} />
              <Tooltip {...s.tooltip} cursor={{ fill: palette.surface2 }} formatter={(x: number, n: string) => [`${x}%`, n]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="nwp" stackId="w" name="NWP" fill={palette.sources.nwp} isAnimationActive={false} />
              <Bar dataKey="ensemble" stackId="w" name="Ensemble" fill={palette.sources.ensemble} isAnimationActive={false} />
              <Bar dataKey="ai" stackId="w" name="AI" fill={palette.sources.ai} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <section className="panel p-5" aria-label="Error table">
          <h3 className="text-sm font-semibold text-fg">Error summary ({v.unit})</h3>
          <table className="mt-3 w-full table-fixed text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th scope="col" className="w-[46%] pb-2 font-medium">
                  Method
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  MAE
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  RMSE
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Bias
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {result.errors.map((e) =>
              <tr key={e.id}>
                  <th scope="row" className="truncate py-2 pr-2 text-left font-normal text-fg">
                    {e.name}
                  </th>
                  <td className="py-2 text-right font-mono tabular-nums text-fg">{fmt(e.mae)}</td>
                  <td className="py-2 text-right font-mono tabular-nums text-fg">{fmt(e.rmse)}</td>
                  <td className="py-2 text-right font-mono tabular-nums text-fg">{fmt(e.bias)}</td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Best individual model ({result.bestSource.toUpperCase()}) and skill-based weights are chosen on the first {result.trainDays} days only,
            then evaluated on the following days — no evaluation data leaks into the choice.
          </p>
        </section>
      </div>
    </section>);

}

function round(x: number, d = 1) {
  const f = 10 ** d;
  return Math.round(x * f) / f;
}