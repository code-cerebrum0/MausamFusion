import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CONSENT_RESET_EVENT, readConsent, writeConsent, type ConsentChoice } from '../../utils/consent';
import { Button } from '../ui/Button';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
    const onReset = () => setVisible(true);
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset);
  }, []);

  const choose = (c: ConsentChoice) => {
    writeConsent(c);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible &&
      <motion.div
        role="region"
        aria-label="Cookie consent"
        className="no-print fixed inset-x-3 bottom-3 z-[60] rounded-2xl border border-line bg-surface p-4 shadow-2xl sm:inset-x-auto sm:left-5 sm:max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
        
          <p className="text-sm font-semibold text-fg">Your privacy choices</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            This site stores your theme and consent choice in your browser. Campaign (UTM) parameters are kept for this session only. No
            third-party trackers are loaded. See our{' '}
            <Link to="/privacy" className="font-medium text-accent hover:underline">
              privacy notice
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button size="sm" onClick={() => choose('all')} className="sm:flex-1">
              Accept all
            </Button>
            <Button size="sm" variant="secondary" onClick={() => choose('essential')} className="sm:flex-1">
              Essential only
            </Button>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}