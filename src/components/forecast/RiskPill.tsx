import React from 'react';
import type { RiskStatus } from '../../utils/forecast';
import { cn } from '../../utils/cn';

export function RiskPill({ status, className }: {status: RiskStatus;className?: string;}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        status === 'High' && 'border-danger/40 bg-danger/10 text-danger',
        status === 'Elevated' && 'border-warn/40 bg-warn/10 text-warn',
        status === 'Low' && 'border-success/40 bg-success/10 text-success',
        className
      )}>
      
      <span
        className={cn('h-1.5 w-1.5 rounded-full', status === 'High' ? 'bg-danger' : status === 'Elevated' ? 'bg-warn' : 'bg-success')}
        aria-hidden="true" />
      
      {status} risk
    </span>);

}