import React from 'react';
import type { SourceId } from '../../types/forecast';
import { forecastDimensions, problemContexts } from '../../data/problemContexts';
import { fixedGlobalWeights, sources } from '../../data/forecastOptions';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../utils/cn';

const BG: Record<SourceId, string> = { nwp: 'bg-nwp', ensemble: 'bg-ens', ai: 'bg-ai' };

function StackBar({ w, label }: {w: Record<SourceId, number>;label: string;}) {
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-surface2" role="img" aria-label={label}>
        {sources.map((s) =>
        <div key={s.id} className={BG[s.id]} style={{ width: `${w[s.id]}%` }} />
        )}
      </div>
      <p className="mt-1.5 font-mono text-[11px] text-muted">
        {sources.map((s) => `${s.label.charAt(0)} ${Math.round(w[s.id])}`).join(' · ')}
      </p>
    </div>);

}

function StrengthDots({ s }: {s: Record<SourceId, number>;}) {
  return (
    <div className="flex items-end gap-4">
      {sources.map((src) =>
      <div key={src.id} className="flex flex-col items-center gap-1">
          <span
          className={cn('rounded-full', BG[src.id])}
          style={{ width: 8 + s[src.id] * 14, height: 8 + s[src.id] * 14, opacity: 0.35 + s[src.id] * 0.65 }}
          aria-hidden="true" />
        
          <span className="text-[10px] text-muted">{src.label}</span>
        </div>
      )}
    </div>);

}

export function ProblemSection() {
  const fixed = { nwp: fixedGlobalWeights.nwp * 100, ensemble: fixedGlobalWeights.ensemble * 100, ai: fixedGlobalWeights.ai * 100 };
  return (
    <section id="problem" className="container-page scroll-mt-24 py-20 sm:py-24" aria-labelledby="problem-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading
            titleId="problem-title"
            title="No single forecast source is right everywhere"
            description="Forecast systems carry different strengths. Which one deserves more trust depends on where, when and what is being forecast." />
          
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {forecastDimensions.map((d) =>
            <div key={d.id} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                <dt className="text-sm font-medium text-fg">{d.title}</dt>
                <dd className="text-sm text-muted">{d.text}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="min-w-0">
          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
              <p className="text-sm font-semibold text-fg">Why fixed global weighting is insufficient</p>
              <p className="text-xs text-muted">Conceptual illustration — not measured skill</p>
            </div>
            <div className="hidden grid-cols-[1.2fr_1fr_1.3fr_1.3fr] gap-4 border-b border-line bg-surface2/50 px-5 py-2.5 text-xs font-medium text-muted md:grid">
              <span>Forecast context</span>
              <span>Individual sources</span>
              <span>→ Fixed weighting</span>
              <span className="text-accent">→ Context-aware blending</span>
            </div>
            <ul className="divide-y divide-line">
              {problemContexts.map((row) =>
              <li key={row.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.2fr_1fr_1.3fr_1.3fr] md:items-center">
                  <div>
                    <p className="text-sm font-medium text-fg">{row.context}</p>
                    <p className="text-xs text-muted">{row.detail}</p>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] text-muted md:hidden">Relative suitability</p>
                    <StrengthDots s={row.strength} />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] text-muted md:hidden">Fixed weighting</p>
                    <StackBar w={fixed} label="Fixed weights: identical for every context" />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] text-accent md:hidden">Context-aware blending</p>
                    <StackBar w={row.adaptive} label={`Context-aware weights for ${row.context}`} />
                  </div>
                </li>
              )}
            </ul>
            <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
              Fixed weighting applies the same mix in every row. Context-aware blending lets the mix follow the context — the goal MausamFusion is
              built around. Values are schematic.
            </p>
          </div>
        </div>
      </div>
    </section>);

}