import React from 'react';
import { ArrowDownIcon } from 'lucide-react';
import { softwareLayers, technologies } from '../../data/softwareStack';
import { cn } from '../../utils/cn';
import { SectionHeading } from '../ui/SectionHeading';
import { Notice } from '../ui/Notice';

export function SoftwareStack() {
  return (
    <section
      id="software"
      className="scroll-mt-24"
      aria-labelledby="software-title">
      
      <SectionHeading
        titleId="software-title"
        title="Data and software architecture"
        description="How a request from the dashboard travels through the API and services down to scientific storage." />
      
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ol
          className="flex flex-col"
          aria-label="Software layers, top to bottom">
          
          {softwareLayers.map((layer, i) =>
          <li key={layer.id}>
              <div
              className={cn(
                'panel p-4',
                layer.id === 'core' && 'border-accent/40 bg-accent/5'
              )}>
              
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-fg">{layer.title}</p>
                  {layer.tech.length > 0 &&
                <p className="font-mono text-[11px] text-muted">
                      {layer.tech.join(' · ')}
                    </p>
                }
                </div>
                <ul
                className={cn(
                  'mt-3 grid gap-2',
                  layer.items.length === 4 ?
                  'grid-cols-2 md:grid-cols-4' :
                  layer.items.length === 3 ?
                  'grid-cols-1 min-[420px]:grid-cols-3' :
                  'grid-cols-2'
                )}>
                
                  {layer.items.map((it) =>
                <li
                  key={it}
                  className="rounded-lg border border-line bg-surface2 px-3 py-2 text-center text-xs text-fg">
                  
                      {it}
                    </li>
                )}
                </ul>
              </div>
              {i < softwareLayers.length - 1 &&
            <div className="flex justify-center py-1.5" aria-hidden="true">
                  <ArrowDownIcon className="h-4 w-4 text-muted" />
                </div>
            }
            </li>
          )}
        </ol>
        <div>
          <h3 className="text-sm font-semibold text-fg">
            Technologies in the design
          </h3>
          <dl className="mt-3 divide-y divide-line border-y border-line">
            {technologies.map((t) =>
            <div
              key={t.name}
              className="grid gap-1 py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4">
              
                <dt className="font-mono text-sm text-fg">{t.name}</dt>
                <dd className="text-sm text-muted">{t.role}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>);

}