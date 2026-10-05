import React, { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon, KeyRoundIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const API_KEY_PATTERN = /^mf_[A-Za-z0-9]{24,}$/;

interface ApiKeyPanelProps {
  apiKey: string;
  onKey: (k: string) => void;
  useInExamples: boolean;
  onUseInExamples: (v: boolean) => void;
}

export function ApiKeyPanel({ apiKey, onKey, useInExamples, onUseInExamples }: ApiKeyPanelProps) {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const id = useId();
  const valid = API_KEY_PATTERN.test(apiKey);
  const showError = touched && apiKey.length > 0 && !valid;

  return (
    <section className="panel p-5" aria-labelledby={`${id}-title`}>
      <div className="flex items-center gap-2">
        <KeyRoundIcon className="h-4 w-4 text-accent" aria-hidden="true" />
        <h2 id={`${id}-title`} className="text-sm font-semibold text-fg">
          Authentication
        </h2>
      </div>
      <p className="mt-1.5 text-sm text-muted">
        Requests use a bearer token. Paste a key to preview it in examples and to run mock write requests. The key stays in this tab’s memory and
        is never stored or sent.
      </p>
      <label htmlFor={`${id}-key`} className="mt-4 block text-xs font-medium text-muted">
        API key
      </label>
      <div className="relative mt-1.5">
        <input
          id={`${id}-key`}
          type={visible ? 'text' : 'password'}
          autoComplete="off"
          spellCheck={false}
          value={apiKey}
          onChange={(e) => onKey(e.target.value.trim())}
          onBlur={() => setTouched(true)}
          placeholder="mf_ followed by at least 24 letters or digits"
          aria-invalid={showError}
          aria-describedby={`${id}-help`}
          className={cn('input h-10 pr-11 font-mono', showError && 'border-danger focus:border-danger focus:ring-danger/30')} />
        
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-fg"
          aria-label={visible ? 'Hide API key' : 'Show API key'}
          aria-pressed={visible}>
          
          {visible ? <EyeOffIcon className="h-4 w-4" aria-hidden="true" /> : <EyeIcon className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      <p id={`${id}-help`} className={cn('mt-1.5 text-xs', showError ? 'text-danger' : valid ? 'text-success' : 'text-muted')} role={showError ? 'alert' : undefined}>
        {showError ? 'Key format not recognised. It should start with “mf_” followed by at least 24 letters or digits.' : valid ? 'Key format looks valid.' : 'Examples use the MAUSAMFUSION_API_KEY environment variable by default.'}
      </p>
      <label className={cn('mt-4 flex items-center gap-2 text-sm', valid ? 'text-fg' : 'text-muted')}>
        <input
          type="checkbox"
          checked={useInExamples && valid}
          disabled={!valid}
          onChange={(e) => onUseInExamples(e.target.checked)}
          className="h-4 w-4 rounded border-line accent-[rgb(var(--accent))]" />
        
        Insert my key into code examples
      </label>
    </section>);

}