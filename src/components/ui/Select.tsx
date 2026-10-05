import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import type { Option } from '../../types/forecast';
import { cn } from '../../utils/cn';

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export function Select({ id, label, value, onChange, options, className }: SelectProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full min-w-0 appearance-none truncate rounded-lg border border-line bg-surface2 pl-3 pr-9 text-sm text-fg transition-[border-color] duration-150 hover:border-muted/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
          
          {options.map((o) =>
          <option key={o.value} value={o.value}>
              {o.label}
            </option>
          )}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
    </div>);

}