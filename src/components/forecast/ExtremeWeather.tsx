import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CloudRainWindIcon, SunIcon, WindIcon, BoxIcon } from "lucide-react";
import { ForecastContext } from "../../types/forecast";
import { extremeEvents, leadTimes } from "../../data/forecastOptions";
import { useTheme } from "../../contexts/ThemeContext";
import { chartStyles } from "../../utils/palette";
import { exceedanceProbability, getLocation, leadLabel, pointForecast, riskStatus } from "../../utils/forecast";
import { fmt, runDemoVerification } from "../../utils/demoVerification";
import { cn } from "../../utils/cn";
import { SectionHeading } from "../ui/SectionHeading";
import { ChartFrame } from "../ui/ChartFrame";
import { DemoBadge } from "../ui/DemoBadge";
import { Button } from "../ui/Button";
import { CalibrationChart } from "../charts/CalibrationChart";
import { RiskPill } from "./RiskPill";
const ICONS: Record<string, BoxIcon> = {
  'heavy-rain': CloudRainWindIcon,
  'heat-wave': SunIcon,
  'high-wind': WindIcon
};
const EXAMPLES: Record<string, Partial<ForecastContext>> = {
  'heavy-rain': {
    locationId: 'mumbai',
    regimeId: 'monsoon-active',
    leadHours: 72
  },
  'heat-wave': {
    locationId: 'ahmedabad',
    regimeId: 'pre-monsoon-heat',
    leadHours: 120
  },
  'high-wind': {
    locationId: 'bhubaneswar',
    regimeId: 'cyclonic',
    leadHours: 48
  }
};
interface ExtremeWeatherProps {
  ctx: ForecastContext;
  loading: boolean;
  onApply: (patch: Partial<ForecastContext>) => void;
}
export function ExtremeWeather({
  ctx,
  loading,
  onApply
}: ExtremeWeatherProps) {
  const {
    palette
  } = useTheme();
  const s = chartStyles(palette);
  const [eventId, setEventId] = useState(extremeEvents[0].id);
  const event = extremeEvents.find((e) => e.id === eventId) ?? extremeEvents[0];
  const loc = getLocation(ctx.locationId);
  const horizon = useMemo(() => leadTimes.map((lead) => {
    const pf = pointForecast({
      ...ctx,
      leadHours: lead
    }, event.variable);
    const p = exceedanceProbability(pf.blend, pf.spread, event.threshold, event.variable);
    return {
      lead,
      label: leadLabel(lead),
      p: Math.round(p * 1000) / 10
    };
  }), [ctx, event]);
  const current = horizon.find((h) => h.lead === ctx.leadHours) ?? horizon[0];
  const peak = horizon.reduce((a, b) => b.p > a.p ? b : a, horizon[0]);
  const status = riskStatus(peak.p / 100);
  const firstElevated = horizon.find((h) => h.p >= 20);
  const ver = useMemo(() => runDemoVerification({
    variable: event.variable,
    leadHours: ctx.leadHours,
    regimeId: ctx.regimeId,
    regionId: loc.region,
    endDate: ctx.date,
    periodId: '1y',
    extra: event.id
  }), [event, ctx, loc.region]);
  const m = ver.metrics.fusion;
  const metricRows = [{
    label: 'Precision',
    value: fmt(m.precision)
  }, {
    label: 'Recall',
    value: fmt(m.recall)
  }, {
    label: 'F1',
    value: fmt(m.f1)
  }, {
    label: 'Brier score',
    value: fmt(m.brier, 3)
  }, {
    label: 'False-alarm rate',
    value: fmt(m.far)
  }, {
    label: 'Miss rate',
    value: fmt(m.missRate)
  }];
  return <section id="extremes" className="scroll-mt-24" aria-labelledby="extremes-title">
      <SectionHeading titleId="extremes-title" title="Extreme-weather guidance" description={`Exceedance probabilities for ${loc.name} across the forecast horizon, derived from the blended forecast and its spread.`} actions={<Button variant="secondary" size="sm" onClick={() => onApply(EXAMPLES[event.id])}>
            Load a {event.label.toLowerCase()} example
          </Button>} />

      <div role="tablist" aria-label="Event type" className="mt-6 flex flex-wrap gap-2">
        {extremeEvents.map((e) => {
        const Icon = ICONS[e.id];
        const sel = e.id === eventId;
        return <button key={e.id} role="tab" aria-selected={sel} aria-controls="extreme-panel" onClick={() => setEventId(e.id)} className={cn('inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-[background-color,border-color,color] duration-150', sel ? 'border-accent/50 bg-accent/10 text-fg' : 'border-line bg-surface text-muted hover:text-fg')}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {e.label}
            </button>;
      })}
      </div>

      <div id="extreme-panel" role="tabpanel" className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="panel p-5" aria-label="Event status">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-fg">{event.label}</h3>
            <DemoBadge />
          </div>
          <div className="mt-5 flex items-end gap-3">
            <p className="font-mono text-4xl font-medium tabular-nums text-fg">{current.p.toFixed(0)}%</p>
            <p className="pb-1 text-sm text-muted">at {leadLabel(ctx.leadHours)}</p>
          </div>
          <RiskPill status={status} className="mt-3" />
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Threshold</dt>
              <dd className="text-right font-medium text-fg">
                ≥ {event.threshold} {event.unit}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Peak in horizon</dt>
              <dd className="text-right font-medium text-fg">
                {peak.p.toFixed(0)}% at {peak.label}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">First ≥ 20%</dt>
              <dd className="text-right font-medium text-fg">{firstElevated ? firstElevated.label : 'None in 10 days'}</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-muted">{event.basis}</p>
        </section>

        <ChartFrame title="Probability across forecast horizon" subtitle="Risk status uses the peak: ≥ 20% elevated, ≥ 50% high" loading={loading} height={260} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={horizon} margin={{
            top: 8,
            right: 12,
            bottom: 0,
            left: -14
          }}>
              <CartesianGrid stroke={s.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={s.tick} stroke={s.grid} />
              <YAxis domain={[0, 100]} tick={s.tick} stroke={s.grid} unit="%" />
              <Tooltip {...s.tooltip} cursor={{
              fill: palette.surface2
            }} formatter={(v: number) => [`${v.toFixed(1)}%`, 'Exceedance probability']} />
              <ReferenceLine y={20} stroke={palette.warn} strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke={palette.danger} strokeDasharray="4 4" />
              <Bar dataKey="p" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {horizon.map((h) => <Cell key={h.lead} fill={h.lead === ctx.leadHours ? palette.accent : palette.muted} fillOpacity={h.lead === ctx.leadHours ? 1 : 0.45} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <ChartFrame title="Event calibration" subtitle="Synthetic 12-month series, upper-quintile event" loading={loading} height={220}>
          <CalibrationChart height={220} series={[{
          id: 'fusion',
          label: 'MausamFusion',
          color: palette.accent,
          bins: m.bins
        }]} />
        </ChartFrame>
        <section className="panel p-5" aria-label="Event verification metrics">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-fg">Event verification metrics</h3>
            <DemoBadge label="" />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
            {metricRows.map((r) => <div key={r.label} className="border-t border-line py-3">
                <dt className="text-xs text-muted">{r.label}</dt>
                <dd className="mt-1 font-mono text-xl tabular-nums text-fg">{r.value}</dd>
              </div>)}
          </dl>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Computed from a synthetic series with a yes/no decision at 50% probability. Shown to illustrate the reporting format; they are not
            results of MausamFusion or any forecast system.
          </p>
        </section>
      </div>
    </section>;
}