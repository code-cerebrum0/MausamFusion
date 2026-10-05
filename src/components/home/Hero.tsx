import React from 'react';
import { ArrowRightIcon, BookOpenIcon, LayersIcon } from 'lucide-react';
import { site } from '../../data/site';
import { ButtonLink } from '../ui/Button';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  return (
    <section className="atmosphere relative overflow-hidden border-b border-line" aria-labelledby="hero-title">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" aria-hidden="true" />
      <div className="container-page relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="min-w-0">
          <p className="text-sm font-medium text-accent">Hybrid AI–NWP multi-model forecast blending</p>
          <h1 id="hero-title" className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-[3.5rem]">
            Context-Aware Weather Forecast Intelligence
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            MausamFusion combines NWP, ensemble and AI forecasts into an adaptive multi-model forecast that learns which source should matter for
            each forecast context.
          </p>
          <blockquote className="mt-8 max-w-xl border-l-2 border-accent pl-5">
            <p className="text-xl font-medium leading-snug text-fg sm:text-2xl">“{site.tagline}”</p>
          </blockquote>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink to="/forecast" size="lg">
              Explore Forecast
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/architecture" size="lg" variant="secondary">
              <LayersIcon className="h-4 w-4" aria-hidden="true" />
              View Architecture
            </ButtonLink>
            <ButtonLink to="/docs" size="lg" variant="ghost">
              <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
              GitHub / Documentation
            </ButtonLink>
          </div>
        </div>
        <div className="min-w-0">
          <HeroVisual />
        </div>
      </div>
    </section>);

}