import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl text-muted transition-[background-color,color] duration-150 hover:bg-surface2 hover:text-fg"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}>
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.9 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}>
          
          {theme === 'dark' ? <SunIcon className="h-4 w-4" aria-hidden="true" /> : <MoonIcon className="h-4 w-4" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>);

}