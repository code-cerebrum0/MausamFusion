import { useEffect, useState } from 'react';

/** Shows a brief loading state whenever the key changes, mirroring a request to the forecast service. */
export function useSimulatedLoad(key: string, ms = 380): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [key, ms]);
  return loading;
}