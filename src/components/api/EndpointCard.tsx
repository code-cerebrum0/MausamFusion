import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircleIcon, CheckCircle2Icon, PlayIcon } from 'lucide-react';
import type { ApiEndpoint } from '../../types/content';
import { site } from '../../data/site';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { CodeBlock } from './CodeBlock';

const SAMPLE: Record<string, string> = {
  variable: 'temperature',
  issued: '2026-10-03',
  lead_hours: '24',
  lat: '28.61',
  lon: '77.21',
  bbox: '68,6,98,36',
  forecast_id: 'fc_20261003_00_t2m',
  event: 'heavy_rain',
  region: 'north',
  period: '90d'
};

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  keyValid: boolean;
  keyForExamples: string;
}

type RunState = 'idle' | 'loading' | 'success' | 'error';

export function EndpointCard({ endpoint, keyValid, keyForExamples }: EndpointCardProps) {
  const [state, setState] = useState<RunState>('idle');
  const [confirm, setConfirm] = useState(false);
  const isPost = endpoint.method === 'POST';

  const path = endpoint.path.replace('{id}', 'fc_20261003_00_t2m');
  const query = endpoint.params.
  filter((p) => p.location === 'query' && p.required).
  map((p) => `${p.name}=${encodeURIComponent(SAMPLE[p.name] ?? 'value')}`).
  join('&');
  const url = `${site.apiBaseUrl}${path}${query ? `?${query}` : ''}`;
  const auth = `-H "Authorization: Bearer ${keyForExamples}"`;
  const curl = isPost ?
  `curl -s -X POST "${url}" \\\n  ${auth} \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(JSON.parse(endpoint.requestBody ?? '{}'))}'` :
  `curl -s "${url}" \\\n  ${auth}`;

  const execute = () => {
    setState('loading');
    window.setTimeout(() => setState('success'), 650);
  };

  const onTry = () => {
    if (isPost && !keyValid) {
      setState('error');
      return;
    }
    if (isPost) setConfirm(true);else
    execute();
  };

  return (
    <article id={endpoint.id} className="panel scroll-mt-24 p-5 sm:p-6" aria-labelledby={`${endpoint.id}-title`}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-mono text-xs font-semibold',
            isPost ? 'bg-warn/15 text-warn' : 'bg-success/15 text-success'
          )}>
          
          {endpoint.method}
        </span>
        <h3 id={`${endpoint.id}-title`} className="min-w-0 break-all font-mono text-base font-medium text-fg">
          {endpoint.path}
        </h3>
        <span className="text-sm text-muted">{endpoint.summary}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{endpoint.description}</p>

      {endpoint.params.length > 0 &&
      <div className="mt-5">
          <h4 className="text-xs font-medium text-muted">Parameters</h4>
          <ul className="mt-2 divide-y divide-line rounded-xl border border-line">
            {endpoint.params.map((p) =>
          <li key={p.name} className="grid gap-1 px-3 py-2.5 text-sm sm:grid-cols-[9rem_9rem_1fr] sm:gap-3">
                <span className="font-mono text-fg">
                  {p.name}
                  {p.required && <span className="ml-1 text-danger" aria-label="required">*</span>}
                </span>
                <span className="break-words font-mono text-xs text-muted sm:pt-0.5">
                  {p.location} · {p.type}
                </span>
                <span className="text-muted">{p.description}</span>
              </li>
          )}
          </ul>
        </div>
      }

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Request" code={curl} />
        <CodeBlock label="Example response · 200" code={endpoint.response} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={onTry} loading={state === 'loading'}>
          {state !== 'loading' && <PlayIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          {state === 'loading' ? 'Running…' : 'Try with local mock'}
        </Button>
        <div aria-live="polite" className="min-w-0 text-sm">
          <AnimatePresence mode="wait">
            {state === 'success' &&
            <motion.p key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-success">
                <CheckCircle2Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                200 OK (mock) — the example response above was returned locally.
              </motion.p>
            }
            {state === 'error' &&
            <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-danger">
                <AlertCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                401 Unauthorized (mock) — add a valid API key above to run write requests.
              </motion.p>
            }
          </AnimatePresence>
        </div>
      </div>

      <ConfirmModal
        open={confirm}
        title={`Send POST ${endpoint.path}?`}
        description="This runs against a local mock only. No data is sent and no job is created."
        confirmLabel="Send mock request"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          execute();
        }} />
      
    </article>);

}