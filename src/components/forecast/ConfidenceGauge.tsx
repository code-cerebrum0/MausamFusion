import React from 'react';
import { motion } from 'framer-motion';

export function ConfidenceGauge({ value, label }: {value: number;label: string;}) {
  const r = 52;
  const circ = Math.PI * r;
  return (
    <div className="flex flex-col items-center" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label="Weight confidence">
      <svg viewBox="0 0 128 72" className="w-48 max-w-full">
        <path d="M12 66 A52 52 0 0 1 116 66" fill="none" className="stroke-surface2" strokeWidth={10} strokeLinecap="round" />
        <motion.path
          d="M12 66 A52 52 0 0 1 116 66"
          fill="none"
          className="stroke-accent"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={false}
          animate={{ strokeDashoffset: circ * (1 - value) }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} />
        
      </svg>
      <p className="-mt-8 font-mono text-2xl font-medium tabular-nums text-fg">{Math.round(value * 100)}%</p>
      <p className="mt-1 text-sm font-medium text-fg">{label} confidence</p>
    </div>);

}