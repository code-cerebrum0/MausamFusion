import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className }: {className?: string;}) {
  return <div className={cn('animate-pulse rounded-lg bg-surface2', className)} aria-hidden="true" />;
}