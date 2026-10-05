import React from 'react';
import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-7 w-7' }: {className?: string;}) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-surface2" />
      <path d="M6 20a10 10 0 0 1 20 0" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-nwp" />
      <path d="M10 20a6 6 0 0 1 12 0" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-ens" />
      <circle cx="16" cy="20" r="2.6" className="fill-ai" />
    </svg>);

}

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 rounded-lg" aria-label="MausamFusion home">
      <LogoMark />
      <span className="text-[13px] font-semibold tracking-[0.14em] text-fg sm:text-sm">MAUSAMFUSION</span>
    </Link>);

}