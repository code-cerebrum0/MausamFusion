import React from 'react';
import { FlaskConicalIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DemoBadgeProps {
  label?: string;
  className?: string;
}

export function DemoBadge({ label = '', className }: DemoBadgeProps) {
  return (
    <span
      title="Synthetic values generated in your browser for demonstration. Not observations, forecasts or measured results."
      className={cn(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-warn/30 bg-warn/10 px-2 py-0.5 text-[11px] font-medium text-warn',
        className
      )}>
      
      <FlaskConicalIcon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>);

}