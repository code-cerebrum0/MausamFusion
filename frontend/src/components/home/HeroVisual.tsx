import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PauseIcon, PlayIcon } from 'lucide-react';
import type { SourceId, Variable } from '../../types/forecast';
import { sources, variables } from '../../data/forecastOptions';
import { colorScale, formatValue } from '../../utils/forecast';
import { cn } from '../../utils/cn';
import { DemoBadge } from '../ui/DemoBadge';

const COLS = 24;
const ROWS = 15;
const CELL = 14;
const MARKER = { c: 9, r: 5 };

const RANGES: Record<Variable, [number, number]> = { temperature: [16, 42], rainfall: [0, 120], wind: [4, 68] };

function fieldValue(variable: Variable, r: number, c: number, t: number) {
  const blobs = [
  { x: 6 + Math.sin(t * 0.5) * 4, y: 5 + Math.cos(t * 0.4) * 2, s: 4.5, a: 1 },
  { x: 16 + Math.cos(t * 0.35) * 5, y: 9 + Math.sin(t * 0.3) * 3, s: 3.6, a: 0.85 },
  { x: 12 + Math.sin(t * 0.28 + 2) * 7, y: 3 + Math.cos(t * 0.5) * 2, s: 3, a: 0.6 },
  { x: 20 + Math.sin(t * 0.42 + 1) * 3, y: 4 + Math.cos(t * 0.33) * 3, s: 2.6, a: 0.7 }];

  let s = 0;
  for (const b of blobs) s += b.a * Math.exp(-((c - b.x) ** 2 + (r - b.y) ** 2) / (2 * b.s * b.s));
  const [lo, hi] = RANGES[variable];
  const base = variable === 'temperature' ? 0.35 + r / ROWS * 0.25 : 0;
  return lo + Math.min(1, base + s * 0.7) * (hi - lo);
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(!reduce);
  const [t, setT] = useState(0);
  const [variable, setVariable] = useState<Variable>('temperature');

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setT((v) => v + 0.06), 110);
    return () => window.clearInterval(id);
  }, [playing]);

  const cells = useMemo(() => {
    const out: {r: number;c: number;fill: string;}[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) out.push({ r, c, fill: colorScale(variable, fieldValue(variable, r, c, t)) });
    return out;
  }, [variable, t]);

  const weights = useMemo(() => {
    const n = 0.48 + 0.12 * Math.sin(t * 0.6);
    const e = 0.32 + 0.1 * Math.sin(t * 0.45 + 1);
    const a = 0.2 + 0.08 * Math.sin(t * 0.7 + 2);
    const sum = n + e + a;
    return { nwp: n / sum, ensemble: e / sum, ai: a / sum } as Record<SourceId, number>;
  }, [t]);

  const readouts = variables.map((v) => ({ ...v, value: fieldValue(v.id, MARKER.r, MARKER.c, t) }));

  return (
    <div className="panel relative overflow-hidden p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Field variable" className="flex rounded-lg border border-line bg-surface2 p-0.5">
          {variables.map((v) =>
          <button
            key={v.id}
            role="tab"
            aria-selected={variable === v.id}
            onClick={() => setVariable(v.id)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-[background-color,color] duration-150',
              variable === v.id ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'
            )}>
            
              {v.label}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge label="Illustrative animation" />
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted hover:text-fg"
            aria-label={playing ? 'Pause animation' : 'Play animation'}>
            
            {playing ? <PauseIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <PlayIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-line bg-surface2">
        <svg viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} className="block h-auto w-full" role="img" aria-label="Animated synthetic forecast field">
          {cells.map((cell) =>
          <rect key={`${cell.r}-${cell.c}`} x={cell.c * CELL} y={cell.r * CELL} width={CELL - 0.6} height={CELL - 0.6} fill={cell.fill} />
          )}
          <circle cx={MARKER.c * CELL + CELL / 2} cy={MARKER.r * CELL + CELL / 2} r={9} fill="none" className="stroke-fg" strokeWidth={1.5} />
          <circle cx={MARKER.c * CELL + CELL / 2} cy={MARKER.r * CELL + CELL / 2} r={2.5} className="fill-fg" />
        </svg>
        <div className="absolute bottom-2 left-2 rounded-lg border border-line bg-surface/90 px-2.5 py-1.5 backdrop-blur">
          <p className="text-[10px] uppercase tracking-wide text-muted">Sample point</p>
          <dl className="mt-0.5 flex gap-3 font-mono text-xs">
            {readouts.map((r) =>
            <div key={r.id} className="flex gap-1">
                <dt className="text-muted">{r.label.charAt(0)}</dt>
                <dd className="text-fg">{formatValue(r.id, r.value)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-fg">Dynamic source weights</span>
          <span className="text-muted">sum = 100%</span>
        </div>
        <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-surface2">
          {sources.map((s) =>
          <motion.div
            key={s.id}
            className={cn(s.id === 'nwp' ? 'bg-nwp' : s.id === 'ensemble' ? 'bg-ens' : 'bg-ai')}
            animate={{ width: `${weights[s.id] * 100}%` }}
            transition={{ duration: 0.12, ease: 'linear' }} />

          )}
        </div>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {sources.map((s) =>
          <li key={s.id} className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span className={cn('h-2 w-2 rounded-full', s.id === 'nwp' ? 'bg-nwp' : s.id === 'ensemble' ? 'bg-ens' : 'bg-ai')} aria-hidden="true" />
                {s.label}
              </div>
              <p className="mt-0.5 font-mono text-lg font-medium tabular-nums text-fg">{Math.round(weights[s.id] * 100)}%</p>
            </li>
          )}
        </ul>
      </div>
    </div>);

}