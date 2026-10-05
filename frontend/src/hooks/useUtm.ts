import { useEffect, useState } from 'react';

const KEY = 'mf-utm';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export type UtmData = Partial<Record<string, string>> & {landing?: string;capturedAt?: string;};

export function readUtm(): UtmData {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as UtmData : {};
  } catch {
    return {};
  }
}

/** Captures UTM parameters from the URL into session storage (first-touch per session). */
export function useUtmCapture(search: string, pathname: string) {
  useEffect(() => {
    const params = new URLSearchParams(search);
    const found: UtmData = {};
    PARAMS.forEach((p) => {
      const v = params.get(p);
      if (v) found[p] = v.slice(0, 120);
    });
    if (Object.keys(found).length === 0) return;
    const existing = readUtm();
    if (Object.keys(existing).length > 0) return;
    found.landing = pathname;
    found.capturedAt = new Date().toISOString();
    try {
      sessionStorage.setItem(KEY, JSON.stringify(found));
    } catch {

      /* ignore */}
  }, [search, pathname]);
}

export function useUtm(): UtmData {
  const [utm, setUtm] = useState<UtmData>({});
  useEffect(() => setUtm(readUtm()), []);
  return utm;
}