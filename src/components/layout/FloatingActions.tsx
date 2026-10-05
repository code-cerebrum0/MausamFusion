import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpIcon, MessageSquareIcon } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export function FloatingActions() {
  const { y } = useScrollProgress();
  const { pathname } = useLocation();
  const showTop = y > 640;
  const showContact = pathname !== '/contact';

  return (
    <div className="no-print fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:right-5">
      <AnimatePresence>
        {showTop &&
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-lg transition-[background-color] duration-150 hover:bg-surface2"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
          
            <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        }
      </AnimatePresence>
      {showContact &&
      <Link
        to="/contact"
        className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-fg shadow-lg transition-[background-color,transform] duration-150 hover:bg-accent/90 active:scale-[0.97]"
        aria-label="Contact the MausamFusion team">
        
          <MessageSquareIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Contact</span>
        </Link>
      }
    </div>);

}