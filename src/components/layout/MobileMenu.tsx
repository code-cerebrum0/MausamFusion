import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MailIcon, SearchIcon } from 'lucide-react';
import { mainNav } from '../../data/navigation';
import { cn } from '../../utils/cn';
import { ButtonLink } from '../ui/Button';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileMenu({ open, onClose, onOpenSearch }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a, button'));
        const f = items[0];
        const l = items[items.length - 1];
        if (e.shiftKey && document.activeElement === f) {
          e.preventDefault();
          l.focus();
        } else if (!e.shiftKey && document.activeElement === l) {
          e.preventDefault();
          f.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <>
          <motion.div
          className="absolute inset-x-0 top-16 z-40 h-[calc(100vh-4rem)] bg-black/50 xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          aria-hidden="true" />
        
          <motion.div
          id="mobile-menu"
          ref={panelRef}
          className="absolute inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-surface shadow-xl xl:hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          
            <nav aria-label="Mobile" className="container-page py-3">
              <ul className="flex flex-col">
                {mainNav.map((item) =>
              <li key={item.to}>
                    <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-lg px-3 py-3 text-base font-medium transition-[background-color,color] duration-150',
                    isActive ? 'bg-surface2 text-fg' : 'text-muted hover:bg-surface2 hover:text-fg'
                  )
                  }>
                  
                      {item.label}
                    </NavLink>
                  </li>
              )}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
                <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface2 text-sm font-medium text-fg">
                
                  <SearchIcon className="h-4 w-4" aria-hidden="true" />
                  Search
                </button>
                <ButtonLink to="/contact" onClick={onClose}>
                  <MailIcon className="h-4 w-4" aria-hidden="true" />
                  Contact
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}