import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircleIcon, CheckCircle2Icon, MailIcon, RotateCcwIcon } from 'lucide-react';
import { site } from '../../data/site';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { MESSAGE_MAX, topics, useContactForm, type ContactValues } from './useContactForm';

const LABELS: Record<keyof ContactValues, string> = {
  name: 'Name',
  email: 'Email',
  organization: 'Organisation',
  topic: 'Topic',
  message: 'Message',
  consent: 'Consent'
};

export function ContactForm({ initialTopic }: {initialTopic: string;}) {
  const f = useContactForm(initialTopic);
  const [discardOpen, setDiscardOpen] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const errorList = Object.entries(f.errors).filter(([, v]) => v) as [keyof ContactValues, string][];
  const showSummary = errorList.length > 0 && f.touched.consent;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = f.requestSubmit();
    if (Object.keys(errs).length > 0) window.setTimeout(() => summaryRef.current?.focus(), 30);
  };

  const fieldClass = (k: keyof ContactValues) => cn('input', f.errors[k] && f.touched[k] && 'border-danger focus:border-danger focus:ring-danger/30');
  const err = (k: keyof ContactValues) =>
  f.errors[k] && f.touched[k] ?
  <p id={`c-${k}-err`} className="mt-1.5 text-xs text-danger">
        {f.errors[k]}
      </p> :
  null;

  if (f.state === 'success') {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="panel p-6 sm:p-8" role="status">
        <CheckCircle2Icon className="h-8 w-8 text-success" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-fg">Your message is ready</h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
          This website has no messaging backend, so nothing has been transmitted yet. Your draft is saved in this browser — open it in your email
          app to send it to <span className="font-medium text-fg">{site.email}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <a href={f.mailto()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-accent-fg hover:bg-accent/90">
            <MailIcon className="h-4 w-4" aria-hidden="true" />
            Open in email app
          </a>
          <Button variant="secondary" onClick={f.reset}>
            Write another message
          </Button>
        </div>
      </motion.div>);

  }

  return (
    <form onSubmit={onSubmit} noValidate className="panel p-5 sm:p-7" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="text-lg font-semibold text-fg">
        Send a message
      </h2>
      <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>

      <AnimatePresence>
        {showSummary &&
        <motion.div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-4 rounded-xl border border-danger/40 bg-danger/5 p-4 text-sm focus:outline-none">
          
            <p className="flex items-center gap-2 font-medium text-danger">
              <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
              Please fix {errorList.length} {errorList.length === 1 ? 'field' : 'fields'}
            </p>
            <ul className="mt-2 space-y-1 pl-6">
              {errorList.map(([k, msg]) =>
            <li key={k}>
                  <a href={`#c-${k}`} onClick={(e) => {e.preventDefault();document.getElementById(`c-${k}`)?.focus();}} className="text-danger underline underline-offset-2">
                    {LABELS[k]}: {msg}
                  </a>
                </li>
            )}
            </ul>
          </motion.div>
        }
      </AnimatePresence>

      {f.state === 'error' &&
      <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
          <span className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
            Your browser blocked saving the draft. Email us directly at {site.email}.
          </span>
          <Button size="sm" variant="secondary" onClick={() => f.setState('confirming')}>
            Try again
          </Button>
        </div>
      }

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-fg">
            Name *
          </label>
          <input id="c-name" autoComplete="name" value={f.values.name} onChange={(e) => f.setField('name', e.target.value)} onBlur={() => f.blur('name')} aria-invalid={!!(f.errors.name && f.touched.name)} aria-describedby={f.errors.name ? 'c-name-err' : undefined} className={fieldClass('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-fg">
            Email *
          </label>
          <input id="c-email" type="email" autoComplete="email" value={f.values.email} onChange={(e) => f.setField('email', e.target.value)} onBlur={() => f.blur('email')} aria-invalid={!!(f.errors.email && f.touched.email)} aria-describedby={f.errors.email ? 'c-email-err' : undefined} className={fieldClass('email')} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="c-organization" className="mb-1.5 block text-sm font-medium text-fg">
            Organisation
          </label>
          <input id="c-organization" autoComplete="organization" value={f.values.organization} onChange={(e) => f.setField('organization', e.target.value)} className="input" />
        </div>
        <div>
          <label htmlFor="c-topic" className="mb-1.5 block text-sm font-medium text-fg">
            Topic
          </label>
          <select id="c-topic" value={f.values.topic} onChange={(e) => f.setField('topic', e.target.value)} className="input h-[38px]">
            {topics.map((t) =>
            <option key={t.value} value={t.value}>
                {t.label}
              </option>
            )}
          </select>
        </div>
        <div className="sm:col-span-2">
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="c-message" className="block text-sm font-medium text-fg">
              Message *
            </label>
            <span className={cn('text-xs tabular-nums', f.values.message.length > MESSAGE_MAX ? 'text-danger' : 'text-muted')} aria-live="polite">
              {f.values.message.length}/{MESSAGE_MAX}
            </span>
          </div>
          <textarea id="c-message" rows={6} value={f.values.message} onChange={(e) => f.setField('message', e.target.value)} onBlur={() => f.blur('message')} aria-invalid={!!(f.errors.message && f.touched.message)} aria-describedby={f.errors.message ? 'c-message-err' : undefined} className={cn(fieldClass('message'), 'resize-y')} />
          {err('message')}
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-muted">
            <input id="c-consent" type="checkbox" checked={f.values.consent} onChange={(e) => f.setField('consent', e.target.checked)} aria-invalid={!!(f.errors.consent && f.touched.consent)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[rgb(var(--accent))]" />
            <span>I agree that MausamFusion may use these details to reply to my message. *</span>
          </label>
          {err('consent')}
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={() => f.isDirty ? setDiscardOpen(true) : f.reset()}>
          <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
          Clear form
        </Button>
        <Button type="submit" loading={f.state === 'sending'}>
          {f.state === 'sending' ? 'Preparing…' : 'Send message'}
        </Button>
      </div>

      <ConfirmModal
        open={f.state === 'confirming'}
        title="Send this message?"
        description={`We’ll prepare your message to ${site.email}. You can review it in your email app before it goes out.`}
        confirmLabel="Yes, prepare it"
        onCancel={() => f.setState('idle')}
        onConfirm={f.send} />
      
      <ConfirmModal
        open={discardOpen}
        title="Discard this draft?"
        description="Everything you’ve typed in this form will be cleared."
        confirmLabel="Discard draft"
        tone="danger"
        onCancel={() => setDiscardOpen(false)}
        onConfirm={() => {
          setDiscardOpen(false);
          f.reset();
        }} />
      
    </form>);

}