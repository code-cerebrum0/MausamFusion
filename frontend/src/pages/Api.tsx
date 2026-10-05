import React, { useState } from 'react';
import { apiEndpoints } from '../data/apiEndpoints';
import { site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { cn } from '../utils/cn';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Notice } from '../components/ui/Notice';
import { CopyButton } from '../components/ui/CopyButton';
import { ApiKeyPanel, API_KEY_PATTERN } from '../components/api/ApiKeyPanel';
import { EndpointCard } from '../components/api/EndpointCard';

export function ApiPage() {
  usePageMeta(
    'API Reference · MausamFusion',
    'MausamFusion REST API reference: health, sources, forecasts, weights, weight maps, uncertainty, extremes, verification, skill, ingest, verify and skill update endpoints with example JSON.'
  );
  const [apiKey, setApiKey] = useState('');
  const [useKey, setUseKey] = useState(true);
  const keyValid = API_KEY_PATTERN.test(apiKey);
  const keyForExamples = keyValid && useKey ? apiKey : '$MAUSAMFUSION_API_KEY';

  const groups = [
  { title: 'Read', items: apiEndpoints.filter((e) => e.method === 'GET') },
  { title: 'Write', items: apiEndpoints.filter((e) => e.method === 'POST') }];


  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        as="h1"
        title="API reference"
        description="A typed REST API (FastAPI) exposes forecasts, weights, uncertainty, extremes, verification and skill memory." />
      
 

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="panel p-5" aria-labelledby="base-title">
          <h2 id="base-title" className="text-sm font-semibold text-fg">
            Base URL
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface2 px-3 py-2">
            <code className="min-w-0 flex-1 break-all font-mono text-sm text-fg">{site.apiBaseUrl}</code>
            <CopyButton text={site.apiBaseUrl} />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Format</dt>
              <dd className="text-fg">JSON (UTF-8)</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Times</dt>
              <dd className="text-fg">ISO 8601, UTC</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Endpoints</dt>
              <dd className="text-fg">{apiEndpoints.length}</dd>
            </div>
          </dl>
        </section>
        <ApiKeyPanel apiKey={apiKey} onKey={setApiKey} useInExamples={useKey} onUseInExamples={setUseKey} />
      </div>

      <div id="endpoints" className="mt-10 grid scroll-mt-24 gap-8 lg:grid-cols-[13rem_1fr]">
        <nav aria-label="Endpoints" className="lg:sticky lg:top-24 lg:self-start">
          {groups.map((g) =>
          <div key={g.title} className="mb-5">
              <p className="mb-2 text-xs font-medium text-muted">{g.title}</p>
              <ul className="flex flex-wrap gap-1 lg:flex-col">
                {g.items.map((e) =>
              <li key={e.id}>
                    <a
                  href={`#${e.id}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    document.getElementById(e.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.replaceState(null, '', `#${e.id}`);
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-mono text-xs text-muted transition-[background-color,color] duration-150 hover:bg-surface2 hover:text-fg">
                  
                      <span className={cn('w-8 shrink-0 text-[10px] font-semibold', e.method === 'POST' ? 'text-warn' : 'text-success')}>{e.method}</span>
                      <span className="truncate">{e.path}</span>
                    </a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </nav>
        <div className="min-w-0 space-y-4">
          {apiEndpoints.map((e) =>
          <EndpointCard key={e.id} endpoint={e} keyValid={keyValid} keyForExamples={keyForExamples} />
          )}
        </div>
      </div>
    </div>);

}