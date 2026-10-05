export type ConsentChoice = 'all' | 'essential';

const KEY = 'mf-cookie-consent';
export const CONSENT_RESET_EVENT = 'mf:consent-reset';

export function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'all' || v === 'essential' ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(KEY, choice);
  } catch {

    /* storage unavailable — banner will reappear next visit */}
}

export function resetConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {

    /* ignore */}
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}