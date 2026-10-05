import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, PowerIcon } from 'lucide-react';
import type { SourceId, Weights } from '../../types/forecast';
import { reliabilityCases } from '../../data/reliability';
import { sources } from '../../data/forecastOptions';
import { ILLUSTRATIVE_WEIGHTS, toPercents } from '../../utils/forecast';
import { cn } from '../../utils/cn';
import { SectionHeading } from '../ui/SectionHeading';
import { DemoBadge } from '../ui/DemoBadge';
import { WeightBar, SOURCE_BG } from '../forecast/WeightBar';

const STEPS = ['Missing forecast source', 'Exclude source', 'Renormalize remaining weights', 'Continue forecast generation'];

export function ReliabilityFlow() {
  const [available, setAvailable] = useState<Record<SourceId, boolean>>({ nwp: true, ensemble: false, ai: true });
  const missing = sources.filter((s) => !available[s.id]).map((s) => s.id);
  const noneLeft = missing.length === sources.length;

  const renormalized = useMemo<Weights>(() => {
    const sum = sources.reduce((a, s) => a + (available[s.id] ? ILLUSTRATIVE_WEIGHTS[s.id] : 0), 0);
    if (sum === 0) return { nwp: 0, ensemble: 0, ai: 0 };
    return {
      nwp: available.nwp ? ILLUSTRATIVE_WEIGHTS.nwp / sum : 0,
      ensemble: available.ensemble ? ILLUSTRATIVE_WEIGHTS.ensemble / sum : 0,
      ai: available.ai ? ILLUSTRATIVE_WEIGHTS.ai / sum : 0
    };
  }, [available]);
  const pBefore = toPercents(ILLUSTRATIVE_WEIGHTS);
  const pAfter = toPercents(renormalized);
  const activeSteps = noneLeft ? 1 : missing.length > 0 ? 4 : 0;

  return (
    <section id="reliability" className="scroll-mt-24" aria-labelledby="reliability-title">
      <SectionHeading
        titleId="reliability-title"
        title="Reliability and failure handling"
        description="Forecast sources go missing, arrive late or arrive broken. The blend keeps running and records what happened." />
      

      <div className="panel mt-8 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-fg">Try it: switch sources off</h3>
            <p className="mt-0.5 text-xs text-muted">Starting from illustrative weights NWP 52%, Ensemble 31%, AI 17%.</p>
          </div>
          <DemoBadge label="Illustrative values" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Source availability">
          {sources.map((s) => {
            const on = available[s.id];
            return (
              <button
                key={s.id}
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => setAvailable((a) => ({ ...a, [s.id]: !a[s.id] }))}
                className={cn(
                  'inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-[background-color,border-color,color] duration-150',
                  on ? 'border-line bg-surface2 text-fg' : 'border-dashed border-danger/50 bg-danger/5 text-danger'
                )}>
                
                <span className={cn('h-2.5 w-2.5 rounded-full', on ? SOURCE_BG[s.id] : 'bg-danger/60')} aria-hidden="true" />
                {s.label}
                <span className="text-xs font-normal">{on ? 'available' : 'unavailable'}</span>
                <PowerIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>);

          })}
        </div>

        <ol className="mt-6 grid gap-2 md:grid-cols-4">
          {STEPS.map((step, i) => {
            const lit = i < activeSteps;
            return (
              <li
                key={step}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-[background-color,border-color,color] duration-200',
                  lit ? 'border-accent/40 bg-accent/10 text-fg' : 'border-line text-muted'
                )}>
                
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]',
                    lit ? 'bg-accent text-accent-fg' : 'bg-surface2 text-muted'
                  )}>
                  
                  {lit ? <CheckIcon className="h-3 w-3" aria-hidden="true" /> : i + 1}
                </span>
                {step}
              </li>);

          })}
        </ol>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Before</p>
            <WeightBar weights={ILLUSTRATIVE_WEIGHTS} excluded={missing} />
          </div>
          <div aria-live="polite">
            <p className="mb-2 text-xs font-medium text-muted">After renormalization</p>
            {noneLeft ?
            <p className="rounded-xl border border-danger/40 bg-danger/5 px-3 py-2.5 text-sm text-danger">
                No sources available — the blend is withheld and an alert is raised instead of issuing an empty forecast.
              </p> :

            <>
                <WeightBar weights={renormalized} />
                {missing.length > 0 &&
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 font-mono text-[11px] text-muted">
                    {sources.
                filter((s) => available[s.id]).
                map((s) => `${s.label} ${pBefore[s.id]}% → ${pAfter[s.id]}%`).
                join(' · ')}
                  </motion.p>
              }
              </>
            }
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line">
        <div className="hidden grid-cols-[12rem_1fr_1fr] gap-6 bg-surface2/60 px-5 py-2.5 text-xs font-medium text-muted md:grid">
          <span>Case</span>
          <span>How it is detected</span>
          <span>What the system does</span>
        </div>
        <ul className="divide-y divide-line bg-surface">
          {reliabilityCases.map((c) =>
          <li key={c.id} className="grid gap-2 px-5 py-4 md:grid-cols-[12rem_1fr_1fr] md:gap-6">
              <p className="text-sm font-medium text-fg">{c.title}</p>
              <p className="text-sm text-muted">
                <span className="font-medium text-fg md:hidden">Detected: </span>
                {c.detection}
              </p>
              <p className="text-sm text-muted">
                <span className="font-medium text-fg md:hidden">Response: </span>
                {c.response}
              </p>
            </li>
          )}
        </ul>
      </div>
    </section>);

}