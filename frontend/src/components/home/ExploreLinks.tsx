import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { exploreLinks } from '../../data/problemContexts';
import { SectionHeading } from '../ui/SectionHeading';

export function ExploreLinks() {
  return (
    <section className="container-page py-20 sm:py-24" aria-labelledby="explore-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading
            titleId="explore-title"
            title="Explore the platform"
            description="Every dashboard on this site runs on synthetic demonstration data generated in your browser and is labelled as such." />
          
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {exploreLinks.map((l) =>
          <li key={l.to}>
              <Link to={l.to} className="group flex items-start gap-4 py-5 transition-[background-color] duration-150 hover:bg-surface2/40 sm:px-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-fg">{l.title}</p>
                  <p className="mt-1 text-sm text-muted">{l.text}</p>
                </div>
                <ArrowUpRightIcon
                className="mt-1 h-4 w-4 shrink-0 text-muted transition-[transform,color] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden="true" />
              
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>);

}