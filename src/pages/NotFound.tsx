import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { mainNav } from '../data/navigation';
import { usePageMeta } from '../hooks/usePageMeta';
import { ButtonLink } from '../components/ui/Button';

export function NotFoundPage() {
  usePageMeta('Page not found · MausamFusion', 'The page you were looking for does not exist on the MausamFusion website.');
  const { pathname } = useLocation();
  return (
    <div className="container-page flex min-h-[60vh] flex-col justify-center py-16">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">This forecast context doesn’t exist</h1>
      <p className="mt-3 max-w-xl break-words text-muted">
        We couldn’t find <span className="font-mono text-fg">{pathname}</span>. It may have moved, or the link may be mistyped.
      </p>
      <div className="mt-8">
        <ButtonLink to="/">
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to overview
        </ButtonLink>
      </div>
      <nav aria-label="Popular pages" className="mt-10">
        <p className="text-sm font-medium text-fg">Or go to</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {mainNav.slice(1).map((n) =>
          <li key={n.to}>
              <Link to={n.to} className="text-sm text-muted hover:text-fg">
                {n.label}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>);

}