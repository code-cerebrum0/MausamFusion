import type { ForecastContext, SourceId, Variable, Weights } from '../types/forecast';
import { leadTimes, locations, regimes, variables } from '../data/forecastOptions';
import { rngFor } from './random';
import { clamp, normalCdf } from './stats';

export const GRID = { cols: 30, rows: 24, lonMin: 68, lonMax: 98, latMin: 6, latMax: 36 };
export const SOURCE_IDS: SourceId[] = ['nwp', 'ensemble', 'ai'];
export const VARIABLE_SCALE: Record<Variable, number> = { temperature: 2.5, rainfall: 22, wind: 9 };

const SOURCE_BIAS: Record<SourceId, Record<Variable, number>> = {
  nwp: { temperature: -0.4, rainfall: -2, wind: 1 },
  ensemble: { temperature: 0.1, rainfall: 1, wind: -1.5 },
  ai: { temperature: 0.3, rainfall: -4, wind: -0.5 }
};

export const ILLUSTRATIVE_WEIGHTS: Weights = { nwp: 0.52, ensemble: 0.31, ai: 0.17 };

export function todayISO(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export const defaultContext: ForecastContext = {
  locationId: 'delhi',
  variable: 'temperature',
  date: todayISO(),
  leadHours: 24,
  model: 'blend',
  regimeId: 'post-monsoon'
};

export function getLocation(id: string) {
  return locations.find((l) => l.id === id) ?? locations[0];
}
export function getRegime(id: string) {
  return regimes.find((r) => r.id === id) ?? regimes[0];
}
export function getVariable(id: Variable) {
  return variables.find((v) => v.id === id) ?? variables[0];
}

export function cellCenter(r: number, c: number) {
  const lon = GRID.lonMin + (c + 0.5) * (GRID.lonMax - GRID.lonMin) / GRID.cols;
  const lat = GRID.latMax - (r + 0.5) * (GRID.latMax - GRID.latMin) / GRID.rows;
  return { lat, lon };
}

export function cellFor(lat: number, lon: number) {
  const c = clamp(Math.floor((lon - GRID.lonMin) / (GRID.lonMax - GRID.lonMin) * GRID.cols), 0, GRID.cols - 1);
  const r = clamp(Math.floor((GRID.latMax - lat) / (GRID.latMax - GRID.latMin) * GRID.rows), 0, GRID.rows - 1);
  return { r, c };
}

interface Blob {
  lat: number;
  lon: number;
  amp: number;
  sigma: number;
}

function makeBlobs(key: string, n: number, ampMin: number, ampMax: number, sMin: number, sMax: number): Blob[] {
  const rng = rngFor(key);
  return Array.from({ length: n }, () => ({
    lat: GRID.latMin + rng() * (GRID.latMax - GRID.latMin),
    lon: GRID.lonMin + rng() * (GRID.lonMax - GRID.lonMin),
    amp: ampMin + rng() * (ampMax - ampMin),
    sigma: sMin + rng() * (sMax - sMin)
  }));
}

function blobSum(blobs: Blob[], lat: number, lon: number, shiftLon = 0): number {
  let s = 0;
  for (const b of blobs) {
    const dLat = lat - b.lat;
    const dLon = lon - (b.lon + shiftLon);
    s += b.amp * Math.exp(-(dLat * dLat + dLon * dLon) / (2 * b.sigma * b.sigma));
  }
  return s;
}

const blobCache = new Map<string, Blob[]>();
function cachedBlobs(key: string, make: () => Blob[]): Blob[] {
  const hit = blobCache.get(key);
  if (hit) return hit;
  const b = make();
  if (blobCache.size > 200) blobCache.clear();
  blobCache.set(key, b);
  return b;
}

function baseBlobs(variable: Variable, ctx: ForecastContext): Blob[] {
  const key = `${variable}|${ctx.date}|${ctx.regimeId}`;
  return cachedBlobs(key, () => {
    if (variable === 'temperature') return makeBlobs(key, 8, -4, 4, 2, 5);
    const blobs =
    variable === 'rainfall' ? makeBlobs(key, 9, 0, 95, 1.2, 3.5) : makeBlobs(key, 7, 0, 38, 1.5, 4);
    if (ctx.regimeId === 'cyclonic') {
      blobs.push({ lat: 15.5, lon: 86.5, amp: variable === 'rainfall' ? 130 : 48, sigma: 2.2 });
    }
    return blobs;
  });
}

function baseValue(variable: Variable, lat: number, lon: number, ctx: ForecastContext, blobs: Blob[]): number {
  const regime = getRegime(ctx.regimeId);
  const shift = ctx.leadHours / 24 * 0.9;
  if (variable === 'temperature') {
    const climatology = 34 - Math.abs(lat - 21) * 0.32 - Math.max(0, lat - 29) * 0.9;
    return climatology + regime.tempOffset + blobSum(blobs, lat, lon, shift);
  }
  if (variable === 'rainfall') {
    return Math.max(0, blobSum(blobs, lat, lon, shift) * regime.rainFactor - 4);
  }
  return Math.max(2, 10 + blobSum(blobs, lat, lon, shift) * regime.windFactor);
}

const fieldCache = new Map<string, number[][]>();

export function sourceField(ctx: ForecastContext, source: SourceId, variable: Variable = ctx.variable): number[][] {
  const key = `${variable}|${ctx.date}|${ctx.regimeId}|${ctx.leadHours}|${source}`;
  const hit = fieldCache.get(key);
  if (hit) return hit;
  const blobs = baseBlobs(variable, ctx);
  const scale = VARIABLE_SCALE[variable];
  const growth = 0.25 + ctx.leadHours / 240;
  const pert = makeBlobs(`${key}|pert`, 6, -scale * growth, scale * growth, 1.5, 4);
  const bias = SOURCE_BIAS[source][variable] * growth;
  const out: number[][] = [];
  for (let r = 0; r < GRID.rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID.cols; c++) {
      const { lat, lon } = cellCenter(r, c);
      let v = baseValue(variable, lat, lon, ctx, blobs) + blobSum(pert, lat, lon) + bias;
      if (variable === 'rainfall') v = Math.max(0, v);
      if (variable === 'wind') v = Math.max(1, v);
      row.push(v);
    }
    out.push(row);
  }
  if (fieldCache.size > 120) fieldCache.clear();
  fieldCache.set(key, out);
  return out;
}

function softmax(logits: Weights, k: number): Weights {
  const e = SOURCE_IDS.map((s) => Math.exp(logits[s] * k));
  const sum = e.reduce((a, b) => a + b, 0);
  return { nwp: e[0] / sum, ensemble: e[1] / sum, ai: e[2] / sum };
}

export function cellWeights(ctx: ForecastContext, lat: number, lon: number): Weights {
  const regime = getRegime(ctx.regimeId);
  const lead = ctx.leadHours;
  let n = 1.1 - lead / 180;
  let e = 0.2 + lead / 150;
  let a = 0.3 + (lead >= 24 && lead <= 168 ? 0.35 : 0.05);
  n += regime.bias.nwp;
  e += regime.bias.ensemble;
  a += regime.bias.ai;
  if (ctx.variable === 'rainfall') e += 0.3;
  if (ctx.variable === 'temperature') n += 0.1;
  if (ctx.variable === 'wind') a += 0.12;
  if (lat > 24 && lon < 88) n += 0.15;
  if (lat < 20 && (lon < 76 || lon > 82)) e += 0.18;
  if (lon > 89 && lat > 21) e += 0.2;
  const nk = `${ctx.variable}|${ctx.regimeId}|${ctx.date}|${lead}`;
  n += blobSum(cachedBlobs(`${nk}|wn`, () => makeBlobs(`${nk}|wn`, 4, -0.25, 0.25, 3, 7)), lat, lon);
  e += blobSum(cachedBlobs(`${nk}|we`, () => makeBlobs(`${nk}|we`, 4, -0.25, 0.25, 3, 7)), lat, lon);
  a += blobSum(cachedBlobs(`${nk}|wa`, () => makeBlobs(`${nk}|wa`, 4, -0.25, 0.25, 3, 7)), lat, lon);
  return softmax({ nwp: n, ensemble: e, ai: a }, 2.2);
}

export function isDefaultContext(ctx: ForecastContext): boolean {
  return (
    ctx.locationId === 'delhi' &&
    ctx.variable === 'temperature' &&
    ctx.leadHours === 24 &&
    ctx.regimeId === 'post-monsoon');

}

export function computeWeights(ctx: ForecastContext): Weights {
  if (isDefaultContext(ctx)) return ILLUSTRATIVE_WEIGHTS;
  const loc = getLocation(ctx.locationId);
  return cellWeights(ctx, loc.lat, loc.lon);
}

export function weightField(ctx: ForecastContext): Weights[][] {
  const out: Weights[][] = [];
  for (let r = 0; r < GRID.rows; r++) {
    const row: Weights[] = [];
    for (let c = 0; c < GRID.cols; c++) {
      const { lat, lon } = cellCenter(r, c);
      row.push(cellWeights(ctx, lat, lon));
    }
    out.push(row);
  }
  return out;
}

export function blendField(ctx: ForecastContext): number[][] {
  const fields = SOURCE_IDS.map((s) => sourceField(ctx, s));
  const wf = weightField(ctx);
  return wf.map((row, r) =>
  row.map((w, c) => w.nwp * fields[0][r][c] + w.ensemble * fields[1][r][c] + w.ai * fields[2][r][c])
  );
}

export function spreadField(ctx: ForecastContext): number[][] {
  const fields = SOURCE_IDS.map((s) => sourceField(ctx, s));
  return fields[0].map((row, r) =>
  row.map((_, c) => {
    const vals = fields.map((f) => f[r][c]);
    return Math.max(...vals) - Math.min(...vals);
  })
  );
}

export function fieldFor(ctx: ForecastContext): number[][] {
  return ctx.model === 'blend' ? blendField(ctx) : sourceField(ctx, ctx.model);
}

export interface PointForecast {
  variable: Variable;
  sources: Record<SourceId, number>;
  weights: Weights;
  blend: number;
  min: number;
  max: number;
  spread: number;
}

export function pointForecast(ctx: ForecastContext, variable: Variable = ctx.variable): PointForecast {
  const c2 = { ...ctx, variable };
  const loc = getLocation(ctx.locationId);
  const { r, c } = cellFor(loc.lat, loc.lon);
  const vals = {
    nwp: sourceField(c2, 'nwp')[r][c],
    ensemble: sourceField(c2, 'ensemble')[r][c],
    ai: sourceField(c2, 'ai')[r][c]
  };
  const weights = computeWeights(c2);
  const blend = vals.nwp * weights.nwp + vals.ensemble * weights.ensemble + vals.ai * weights.ai;
  const arr = Object.values(vals);
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return { variable, sources: vals, weights, blend, min, max, spread: max - min };
}

export function weightConfidence(pf: PointForecast): number {
  return clamp(1 - pf.spread / (VARIABLE_SCALE[pf.variable] * 2.2), 0.05, 0.98);
}

export function confidenceLabel(c: number): 'High' | 'Moderate' | 'Low' {
  if (c >= 0.7) return 'High';
  if (c >= 0.45) return 'Moderate';
  return 'Low';
}

export function exceedanceProbability(value: number, spread: number, threshold: number, variable: Variable): number {
  const sigma = Math.max(spread * 0.6, VARIABLE_SCALE[variable] * 0.35);
  return normalCdf((value - threshold) / sigma);
}

export function leadLabel(h: number): string {
  return h < 48 ? `${h} h` : `Day ${h / 24}`;
}

export function leadSeries(ctx: ForecastContext, variable: Variable = ctx.variable) {
  return leadTimes.map((lead) => {
    const pf = pointForecast({ ...ctx, leadHours: lead }, variable);
    return {
      lead,
      label: leadLabel(lead),
      nwp: round(pf.sources.nwp),
      ensemble: round(pf.sources.ensemble),
      ai: round(pf.sources.ai),
      blend: round(pf.blend),
      range: [round(pf.min), round(pf.max)] as [number, number],
      spread: round(pf.spread)
    };
  });
}

export function weightTimeline(ctx: ForecastContext) {
  return leadTimes.map((lead) => {
    const p = toPercents(computeWeights({ ...ctx, leadHours: lead }));
    return { lead, label: leadLabel(lead), ...p };
  });
}

export function toPercents(w: Weights): Record<SourceId, number> {
  const raw = SOURCE_IDS.map((s) => w[s] * 100);
  const floors = raw.map(Math.floor);
  let rem = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw.map((v, i) => ({ i, f: v - Math.floor(v) })).sort((a, b) => b.f - a.f);
  for (const o of order) {
    if (rem <= 0) break;
    floors[o.i] += 1;
    rem -= 1;
  }
  return { nwp: floors[0], ensemble: floors[1], ai: floors[2] };
}

export function dominantSource(w: Weights): SourceId {
  return SOURCE_IDS.reduce((best, s) => w[s] > w[best] ? s : best, 'nwp' as SourceId);
}

function round(v: number) {
  return Math.round(v * 10) / 10;
}

export function formatValue(variable: Variable, v: number): string {
  if (variable === 'temperature') return `${v.toFixed(1)} °C`;
  if (variable === 'rainfall') return `${v.toFixed(1)} mm`;
  return `${Math.round(v)} km/h`;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function validTime(date: string, leadHours: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCHours(d.getUTCHours() + leadHours);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${hh}:00 UTC`;
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

type Stop = [number, [number, number, number, number]];
const SCALES: Record<Variable, Stop[]> = {
  temperature: [
  [5, [59, 91, 200, 0.9]],
  [15, [63, 140, 210, 0.9]],
  [22, [63, 182, 201, 0.9]],
  [28, [155, 210, 122, 0.9]],
  [33, [242, 201, 76, 0.92]],
  [38, [242, 153, 74, 0.95]],
  [43, [214, 69, 69, 1]]],

  rainfall: [
  [0, [148, 163, 184, 0.1]],
  [2, [125, 211, 252, 0.4]],
  [15, [56, 189, 248, 0.7]],
  [40, [37, 99, 235, 0.88]],
  [80, [79, 70, 229, 0.95]],
  [140, [147, 51, 234, 1]]],

  wind: [
  [0, [148, 163, 184, 0.15]],
  [15, [94, 234, 212, 0.45]],
  [30, [45, 212, 191, 0.75]],
  [50, [234, 179, 8, 0.9]],
  [70, [239, 68, 68, 1]]]

};

export function colorScale(variable: Variable, v: number): string {
  const stops = SCALES[variable];
  if (v <= stops[0][0]) return rgba(stops[0][1]);
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const [v0, c0] = stops[i - 1];
      const [v1, c1] = stops[i];
      const t = (v - v0) / (v1 - v0);
      return rgba([0, 1, 2, 3].map((k) => c0[k] + (c1[k] - c0[k]) * t) as [number, number, number, number]);
    }
  }
  return rgba(stops[stops.length - 1][1]);
}

export function scaleStops(variable: Variable) {
  return SCALES[variable].map(([v, c]) => ({ value: v, color: rgba(c) }));
}

export function spreadColor(variable: Variable, spread: number): string {
  const t = clamp(spread / (VARIABLE_SCALE[variable] * 2.4), 0, 1);
  return `rgba(245,158,66,${(0.08 + t * 0.87).toFixed(2)})`;
}

export function disagreementLabel(variable: Variable, spread: number): 'Low' | 'Moderate' | 'High' {
  const t = spread / VARIABLE_SCALE[variable];
  if (t < 0.9) return 'Low';
  if (t < 1.8) return 'Moderate';
  return 'High';
}

export type RiskStatus = 'Low' | 'Elevated' | 'High';
export function riskStatus(p: number): RiskStatus {
  if (p >= 0.5) return 'High';
  if (p >= 0.2) return 'Elevated';
  return 'Low';
}

function rgba(c: [number, number, number, number]) {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(2)})`;
}