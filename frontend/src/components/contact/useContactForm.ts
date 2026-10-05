import { useCallback, useState } from 'react';
import { site } from '../../data/site';
import { readUtm } from '../../hooks/useUtm';

export interface ContactValues {
  name: string;
  email: string;
  organization: string;
  topic: string;
  message: string;
  consent: boolean;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;
export type SubmitState = 'idle' | 'confirming' | 'sending' | 'success' | 'error';

export const topics = [
{ value: 'general', label: 'General question' },
{ value: 'research', label: 'Research collaboration' },
{ value: 'api', label: 'API access' },
{ value: 'repository', label: 'Repository access' },
{ value: 'press', label: 'Press' }];


const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MESSAGE_MAX = 2000;

export function validate(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (v.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
  if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address, like name@example.org.';
  if (v.message.trim().length < 20) e.message = 'Tell us a little more — at least 20 characters.';
  if (v.message.length > MESSAGE_MAX) e.message = `Keep the message under ${MESSAGE_MAX} characters.`;
  if (!v.consent) e.consent = 'Please confirm we may use your details to reply.';
  return e;
}

export function useContactForm(initialTopic: string) {
  const empty: ContactValues = { name: '', email: '', organization: '', topic: initialTopic, message: '', consent: false };
  const [values, setValues] = useState<ContactValues>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactValues, boolean>>>({});
  const [state, setState] = useState<SubmitState>('idle');

  const setField = useCallback(<K extends keyof ContactValues,>(k: K, val: ContactValues[K]) => {
    setValues((cur) => {
      const next = { ...cur, [k]: val };
      setErrors((err) => err[k] ? { ...err, [k]: validate(next)[k] } : err);
      return next;
    });
  }, []);

  const blur = (k: keyof ContactValues) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((err) => ({ ...err, [k]: validate(values)[k] }));
  };

  const requestSubmit = (): ContactErrors => {
    const e = validate(values);
    setErrors(e);
    setTouched({ name: true, email: true, message: true, consent: true });
    if (Object.keys(e).length === 0) setState('confirming');
    return e;
  };

  const send = () => {
    setState('sending');
    window.setTimeout(() => {
      try {
        const outbox = JSON.parse(localStorage.getItem('mf-outbox') ?? '[]') as unknown[];
        outbox.push({ ...values, utm: readUtm(), savedAt: new Date().toISOString() });
        localStorage.setItem('mf-outbox', JSON.stringify(outbox.slice(-5)));
        setState('success');
      } catch {
        setState('error');
      }
    }, 800);
  };

  const reset = () => {
    setValues({ ...empty, topic: values.topic });
    setErrors({});
    setTouched({});
    setState('idle');
  };

  const isDirty = values.name !== '' || values.email !== '' || values.organization !== '' || values.message !== '';

  const mailto = () => {
    const utm = readUtm();
    const utmLine = Object.entries(utm).
    filter(([k]) => k.startsWith('utm_')).
    map(([k, val]) => `${k}=${val}`).
    join('&');
    const topic = topics.find((t) => t.value === values.topic)?.label ?? values.topic;
    const body = [
    values.message,
    '',
    `— ${values.name}${values.organization ? `, ${values.organization}` : ''}`,
    values.email,
    utmLine ? `\nCampaign: ${utmLine}` : ''].
    join('\n');
    return `mailto:${site.email}?subject=${encodeURIComponent(`[MausamFusion] ${topic}`)}&body=${encodeURIComponent(body)}`;
  };

  return { values, errors, touched, state, setState, setField, blur, requestSubmit, send, reset, isDirty, mailto };
}