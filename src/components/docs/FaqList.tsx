import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import type { FaqItem } from '../../types/content';
import { cn } from '../../utils/cn';

export function FaqList({ items }: {items: FaqItem[];}) {
  const [open, setOpen] = useState<number[]>([0]);
  const baseId = useId();
  const allOpen = open.length === items.length;

  const toggle = (i: number) => setOpen((cur) => cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? [] : items.map((_, i) => i))}
          className="text-sm font-medium text-accent hover:underline">
          
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item, i) => {
          const isOpen = open.includes(i);
          const btnId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <li key={item.question}>
              <h3>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-fg transition-[color] duration-150 hover:text-accent">
                  
                  {item.question}
                  <ChevronDownIcon
                    className={cn('h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out', isOpen && 'rotate-180')}
                    aria-hidden="true" />
                  
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen &&
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden">
                  
                    <p className="max-w-3xl pb-5 text-sm leading-relaxed text-muted">{item.answer}</p>
                  </motion.div>
                }
              </AnimatePresence>
            </li>);

        })}
      </ul>
    </div>);

}