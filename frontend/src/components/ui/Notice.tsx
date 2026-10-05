import React from 'react';
import { AlertTriangleIcon, InfoIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NoticeProps {
  tone?: 'info' | 'warn';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Notice({ tone = 'info', title, children, className }: NoticeProps) {
  const Icon = tone === 'warn' ? AlertTriangleIcon : InfoIcon;
  return (
    <div
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3 text-sm',
        tone === 'warn' ? 'border-warn/30 bg-warn/5' : 'border-accent/25 bg-accent/5',
        className
      )}>
      
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tone === 'warn' ? 'text-warn' : 'text-accent')} aria-hidden="true" />
      <div className="min-w-0 text-muted">
        {title && <p className="mb-0.5 font-medium text-fg">{title}</p>}
        {children}
      </div>
    </div>);

}