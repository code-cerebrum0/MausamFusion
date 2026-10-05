import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ActivityIcon, ArrowRightIcon, CombineIcon, DatabaseZapIcon, GaugeIcon, NetworkIcon, PauseIcon, PlayIcon, ScaleIcon, BoxIcon } from "lucide-react";
import { pipelineStages } from "../../data/pipeline";
import { cn } from "../../utils/cn";
import { SectionHeading } from "../ui/SectionHeading";
const ICONS: Record<string, BoxIcon> = {
  ingest: DatabaseZapIcon,
  context: NetworkIcon,
  weights: ScaleIcon,
  blend: CombineIcon,
  uncertainty: GaugeIcon,
  verify: ActivityIcon
};
export function PipelineSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(!reduce);
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % pipelineStages.length), 3200);
    return () => window.clearInterval(id);
  }, [auto]);
  const stage = pipelineStages[active];
  const pct = (active + 0.5) / pipelineStages.length * 100;
  return <section id="pipeline" className="scroll-mt-24 border-y border-line bg-surface/50 py-20 sm:py-24" aria-labelledby="pipeline-title">
      <div className="container-page">
        <SectionHeading titleId="pipeline-title" title="A six-stage pipeline that learns as it verifies" description="Every forecast cycle moves through the same loop. Select a stage to see what goes in and what comes out." actions={<button type="button" onClick={() => setAuto((a) => !a)} className="inline-flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted hover:text-fg" aria-pressed={auto}>
              {auto ? <PauseIcon className="h-4 w-4" aria-hidden="true" /> : <PlayIcon className="h-4 w-4" aria-hidden="true" />}
              {auto ? 'Pause walkthrough' : 'Play walkthrough'}
            </button>} />

        <div className="relative mt-12">
          <div className="absolute left-[8.33%] right-[8.33%] top-7 hidden lg:block" aria-hidden="true">
            <svg className="h-1 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 1">
              <line x1="0" y1="0.5" x2="100" y2="0.5" className="stroke-line" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="0.5" x2="100" y2="0.5" className="flow-dash stroke-accent/70" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <motion.span className="absolute -top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgb(var(--accent)/0.2)]" animate={{
            left: `${(pct - 8.33) / 83.34 * 100}%`
          }} transition={{
            type: 'spring',
            stiffness: 160,
            damping: 24
          }} />
          </div>
          <ol className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
            {pipelineStages.map((s, i) => {
            const Icon = ICONS[s.id];
            const isActive = i === active;
            return <li key={s.id}>
                  <button type="button" onClick={() => {
                setActive(i);
                setAuto(false);
              }} aria-current={isActive ? 'step' : undefined} className={cn('flex h-full w-full items-center gap-3 rounded-xl border p-3 text-left transition-[background-color,border-color] duration-200 lg:flex-col lg:items-center lg:p-4 lg:text-center', isActive ? 'border-accent/50 bg-accent/10' : 'border-transparent hover:bg-surface2')}>
                    <span className={cn('relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-[background-color,border-color,color] duration-200', isActive ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-muted')}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] text-muted">Stage {i + 1}</span>
                      <span className={cn('block text-sm font-medium leading-snug', isActive ? 'text-fg' : 'text-muted')}>{s.title}</span>
                    </span>
                  </button>
                </li>;
          })}
          </ol>
        </div>

        <div className="mt-8 panel p-5 sm:p-6" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={stage.id} initial={{
            opacity: 0,
            y: 6
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -4
          }} transition={{
            duration: 0.18,
            ease: [0.23, 1, 0.32, 1]
          }} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="text-lg font-semibold text-fg">
                  {active + 1}. {stage.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{stage.summary}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <ul className="flex flex-wrap gap-1.5">
                  {stage.inputs.map((x) => <li key={x} className="rounded-lg border border-line bg-surface2 px-2.5 py-1 text-muted">
                      {x}
                    </li>)}
                </ul>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-accent" aria-label="produces" />
                <ul className="flex flex-wrap gap-1.5">
                  {stage.outputs.map((x) => <li key={x} className="rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 font-medium text-fg">
                      {x}
                    </li>)}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>;
}