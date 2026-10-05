import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  title: string;
  titleId?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeading({ title, titleId, description, actions, as = 'h2', className }: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-3xl">
        <Tag
          id={titleId}
          className={cn(
            'font-semibold tracking-tight text-fg',
            as === 'h1' ? 'text-3xl sm:text-4xl' : as === 'h2' ? 'text-2xl sm:text-3xl' : 'text-lg'
          )}>
          
          {title}
        </Tag>
        {description && <div className="mt-3 text-base leading-relaxed text-muted">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>);

}