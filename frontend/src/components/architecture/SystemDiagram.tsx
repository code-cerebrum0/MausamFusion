import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from 'lucide-react';
import { architectureNodes } from '../../data/architecture';
import type { ArchitectureNode } from '../../types/content';
import { cn } from '../../utils/cn';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

function NodeDetail({ node, index, onStep }: {node: ArchitectureNode;index: number;onStep: (d: number) => void;}) {
  return (
    <div>
      <p className="font-mono text-xs text-muted">
        Component {index + 1} of {architectureNodes.length}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-fg">{node.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{node.responsibility}</p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-muted">Inputs</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {node.inputs.map((x) =>
            <span key={x} className="rounded-lg border border-line bg-surface2 px-2 py-0.5 text-xs text-fg">
                {x}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Outputs</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {node.outputs.map((x) =>
            <span key={x} className="rounded-lg border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-fg">
                {x}
              </span>
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => onStep(-1)} disabled={index === 0}>
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onStep(1)}>
          {index === architectureNodes.length - 1 ? 'Back to skill memory' : 'Next'}
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>);

}

export function SystemDiagram() {
  const [active, setActive] = useState(0);
  const node = architectureNodes[active];
  const memoryIdx = architectureNodes.findIndex((n) => n.id === 'memory');

  const step = (d: number) => {
    setActive((a) => {
      if (d > 0 && a === architectureNodes.length - 1) return memoryIdx;
      return Math.max(0, Math.min(architectureNodes.length - 1, a + d));
    });
  };

  return (
    <section id="system" className="scroll-mt-24" aria-labelledby="system-title">
      <SectionHeading
        as="h1"
        titleId="system-title"
        title="System architecture"
        description="From external forecast sources to an updated skill memory — and back again. Select any component to see what it is responsible for." />
      
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <ol className="flex flex-col" aria-label="Architecture components">
          {architectureNodes.map((n, i) => {
            const isActive = i === active;
            const isLoopTarget = n.id === 'memory';
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-expanded={isActive}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-[background-color,border-color] duration-150',
                    isActive ? 'border-accent/60 bg-accent/10' : 'border-line bg-surface hover:border-muted/40 hover:bg-surface2'
                  )}>
                  
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px]',
                      isActive ? 'bg-accent text-accent-fg' : 'bg-surface2 text-muted'
                    )}>
                    
                    {i + 1}
                  </span>
                  <span className={cn('text-sm', isActive ? 'font-medium text-fg' : 'text-fg/90')}>{n.title}</span>
                  {isLoopTarget &&
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted" title="Loop returns here">
                      <RotateCcwIcon className="h-3 w-3" aria-hidden="true" /> loop
                    </span>
                  }
                </button>
                <AnimatePresence initial={false}>
                  {isActive &&
                  <motion.div
                    className="overflow-hidden lg:hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
                    
                      <div className="panel mt-2 p-4">
                        <NodeDetail node={n} index={i} onStep={step} />
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
                {i < architectureNodes.length - 1 ?
                <div className="flex justify-center py-1" aria-hidden="true">
                    <ArrowDownIcon className="h-3.5 w-3.5 text-muted" />
                  </div> :

                <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
                    <RotateCcwIcon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    Updated skill feeds back into Historical + Recent Skill Memory
                  </p>
                }
              </li>);

          })}
        </ol>
        <div className="hidden lg:block">
          <div className="panel sticky top-24 p-6" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
                
                <NodeDetail node={node} index={active} onStep={step} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>);

}