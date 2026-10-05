import React from 'react';
import { motion } from 'framer-motion';
import type { SourceId, Weights } from '../../types/forecast';
import { sources } from '../../data/forecastOptions';
import { toPercents } from '../../utils/forecast';
import { cn } from '../../utils/cn';

export const SOURCE_BG: Record<SourceId, string> = { nwp: 'bg-nwp', ensemble: 'bg-ens', ai: 'bg-ai' };

interface WeightBarProps {
  weights: Weights;
  showLabels?: boolean;
  size?: 'sm' | 'md';
  excluded?: SourceId[];
}

export function WeightBar({ weights, showLabels = true, size = 'md', excluded = [] }: WeightBarProps) {
  const p = toPercents(weights);
  return (
    <div>
      <div
        className={cn('flex overflow-hidden rounded-full bg-surface2', size === 'sm' ? 'h-1.5' : 'h-2.5')}
        role="img"
        aria-label={`Model contribution: ${sources.map((s) => `${s.label} ${p[s.id]}%`).join(', ')}`}>
        
        {sources.map((s) =>
        <motion.div
          key={s.id}
          className={SOURCE_BG[s.id]}
          initial={false}
          animate={{ width: `${weights[s.id] * 100}%` }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} />

        )}
      </div>
      {showLabels &&
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {sources.map((s) =>
        <li key={s.id} className={cn('flex items-center gap-1.5', excluded.includes(s.id) && 'line-through opacity-60')}>
              <span className={cn('h-2 w-2 rounded-full', SOURCE_BG[s.id])} aria-hidden="true" />
              <span className="text-muted">{s.label}</span>
              <span className="font-mono font-medium tabular-nums text-fg">{p[s.id]}%</span>
            </li>
        )}
        </ul>
      }
    </div>);

}