import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { footerNav } from '../../data/navigation';
import { site } from '../../data/site';
import { formatDate } from '../../utils/forecast';
import { resetConsent } from '../../utils/consent';
import { LogoMark } from '../ui/Logo';
import { ConfirmModal } from '../ui/ConfirmModal';
import { toast } from 'sonner';

export function Footer() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_3fr]">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2" aria-label="MausamFusion home">
              <LogoMark />
              <span className="text-sm font-semibold tracking-[0.14em] text-fg">MAUSAMFUSION</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.tagline}</p>
            <a href={`mailto:${site.email}`} className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
              {site.email}
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerNav.map((group) =>
            <div key={group.title}>
                <h2 className="text-sm font-semibold text-fg">{group.title}</h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((l) =>
                <li key={l.to}>
                      <Link to={l.to} className="text-sm text-muted transition-[color] duration-150 hover:text-fg">
                        {l.label}
                      </Link>
                    </li>
                )}
                </ul>
              </div>
            )}
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} MausamFusion. Last updated <time dateTime={site.lastUpdated}>{formatDate(site.lastUpdated)}</time>.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link to="/privacy" className="hover:text-fg">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-fg">
                Terms
              </Link>
            </li>
            <li>
              <button type="button" onClick={() => setConfirmOpen(true)} className="hover:text-fg">
                Cookie settings
              </button>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-fg">
                Email us
              </a>
            </li>
          </ul>
        </div>
      </div>
      <ConfirmModal
        open={confirmOpen}
        title="Reset cookie preferences?"
        description="Your current choice will be cleared and the consent banner will be shown again."
        confirmLabel="Reset preferences"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          resetConsent();
          setConfirmOpen(false);
          toast.success('Cookie preferences reset');
        }} />
      
    </footer>);

}