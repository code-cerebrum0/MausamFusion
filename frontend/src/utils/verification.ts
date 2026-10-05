import type { MethodId, SourceId, Variable, Weights } from '../types/forecast';
import { fixedGlobalWeights } from '../data/forecastOptions';
import { gaussian, rngFor } from './random';
import { SOURCE_IDS, VARIABLE_SCALE, getRegime } from './forecast';
import { mean, normalCdf, normalPdf } from './stats';

export interface SyntheticSeries {
  truth: number[];
  sources: Record<SourceId, number[]>;
  spread: number[];
  weights: Weights[];
  dates: string[];
  trainEnd: number;
}

interface SeriesOptions {
  key: string;
  n: number;
  variable: Variable;
  leadHours: number;
  regimeId: string;
  endDate: string;
  spanDays: number;
  baseWeights: Weights;
}

/**
 * Generates a synthetic reference series and three synthetic source forecasts.
 * Error magnitudes and biases are drawn at random per source — no method is
 * constructed to outperform another. Used only for interface demonstration.
 */
export function syntheticSeries(o: SeriesOptions): SyntheticSeries {
  const rng = rngFor(o.key);
  const regime = getRegime(o.regimeId);
  const scale = VARIABLE_SCALE[o.variable];
  const errScale = scale * (0.35 + o.leadHours / 240 * 0.8);
  const level =
  o.variable === 'temperature' ? 30 + regime.tempOffset : o.variable === 'rainfall' ? 30 * regime.rainFactor : 16 * regime.windFactor;

  const truth: number[] = [];
  let ar = 0;
  for (let t = 0; t < o.n; t++) {
    ar = 0.7 * ar + gaussian(rng) * scale * 0.6;
    let v = level + Math.sin(2 * Math.PI * t / Math.max(8, o.n / 2)) * scale * 0.8 + ar;
    if (o.variable === 'rainfall') v = Math.max(0, level * Math.exp(gaussian(rng) * 0.8) - 3 + ar);
    if (o.variable === 'wind') v = Math.max(2, v);
    truth.push(v);
  }

  const sources = {} as Record<SourceId, number[]>;
  for (const s of SOURCE_IDS) {
    const f = 0.8 + rng() * 0.5;
    const b = (rng() - 0.5) * errScale * 0.8;
    let e = 0;
    sources[s] = truth.map((y) => {
      e = 0.6 * e + gaussian(rng) * errScale * f;
      let v = y + b + e;
      if (o.variable !== 'temperature') v = Math.max(0, v);
      return v;
    });
  }

  const spread = truth.map((_, t) => {
    const vals = SOURCE_IDS.map((s) => sources[s][t]);
    return Math.max(...vals) - Math.min(...vals);
  });

  const weights = truth.map(() => {
    const logits = SOURCE_IDS.map((s) => Math.log(Math.max(o.baseWeights[s], 1e-3)) + gaussian(rng) * 0.15);
    const ex = logits.map(Math.exp);
    const sum = ex.reduce((a, b) => a + b, 0);
    return { nwp: ex[0] / sum, ensemble: ex[1] / sum, ai: ex[2] / sum };
  });

  const end = new Date(`${o.endDate}T00:00:00Z`).getTime();
  const step = o.spanDays * 86400000 / Math.max(1, o.n - 1);
  const dates = truth.map((_, t) => new Date(end - (o.n - 1 - t) * step).toISOString().slice(0, 10));

  return { truth, sources, spread, weights, dates, trainEnd: Math.max(3, Math.floor(o.n / 3)) };
}

function maeOf(f: number[], y: number[], from = 0, to = y.length) {
  let s = 0;
  for (let i = from; i < to; i++) s += Math.abs(f[i] - y[i]);
  return s / Math.max(1, to - from);
}
function mseOf(f: number[], y: number[], from = 0, to = y.length) {
  let s = 0;
  for (let i = from; i < to; i++) s += (f[i] - y[i]) ** 2;
  return s / Math.max(1, to - from);
}

export interface MethodResult {
  forecasts: Record<MethodId, number[]>;
  bestSource: SourceId;
  skillWeights: Weights;
}

/** Baselines that need past skill use only the training window (no leakage into evaluation). */
export function methodForecasts(s: SyntheticSeries): MethodResult {
  const tr = s.trainEnd;
  const trainMse = SOURCE_IDS.map((src) => mseOf(s.sources[src], s.truth, 0, tr));
  const bestIdx = trainMse.indexOf(Math.min(...trainMse));
  const bestSource = SOURCE_IDS[bestIdx];
  const inv = trainMse.map((m) => 1 / Math.max(m, 1e-6));
  const invSum = inv.reduce((a, b) => a + b, 0);
  const skillWeights = { nwp: inv[0] / invSum, ensemble: inv[1] / invSum, ai: inv[2] / invSum };
  const combine = (w: (t: number) => Weights) =>
  s.truth.map((_, t) => {
    const ww = w(t);
    return SOURCE_IDS.reduce((acc, src) => acc + ww[src] * s.sources[src][t], 0);
  });
  return {
    bestSource,
    skillWeights,
    forecasts: {
      best: s.sources[bestSource],
      equal: combine(() => ({ nwp: 1 / 3, ensemble: 1 / 3, ai: 1 / 3 })),
      fixed: combine(() => fixedGlobalWeights),
      skill: combine(() => skillWeights),
      fusion: combine((t) => s.weights[t])
    }
  };
}

export interface ReliabilityBin {
  bin: string;
  forecast: number;
  observed: number;
  count: number;
}

export interface MetricSet {
  mae: number;
  rmse: number;
  bias: number;
  crps: number;
  brier: number;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  far: number | null;
  missRate: number | null;
  reliability: number;
  bins: ReliabilityBin[];
}

export function computeMetrics(
f: number[],
y: number[],
spread: number[],
variable: Variable,
threshold: number,
from: number)
: MetricSet {
  const scale = VARIABLE_SCALE[variable];
  const idx = y.map((_, i) => i).slice(from);
  const err = idx.map((i) => f[i] - y[i]);
  const mae = mean(err.map(Math.abs));
  const rmse = Math.sqrt(mean(err.map((e) => e * e)));
  const bias = mean(err);
  const sig = idx.map((i) => Math.max(spread[i] * 0.6, scale * 0.3));
  const crps = mean(
    idx.map((i, k) => {
      const z = (y[i] - f[i]) / sig[k];
      return sig[k] * (z * (2 * normalCdf(z) - 1) + 2 * normalPdf(z) - 1 / Math.sqrt(Math.PI));
    })
  );
  const probs = idx.map((i, k) => 1 - normalCdf((threshold - f[i]) / sig[k]));
  const obs = idx.map((i) => y[i] >= threshold ? 1 : 0);
  const brier = mean(probs.map((p, k) => (p - obs[k]) ** 2));
  let hits = 0;
  let fa = 0;
  let miss = 0;
  probs.forEach((p, k) => {
    const yes = p >= 0.5;
    if (yes && obs[k]) hits++;else
    if (yes && !obs[k]) fa++;else
    if (!yes && obs[k]) miss++;
  });
  const precision = hits + fa > 0 ? hits / (hits + fa) : null;
  const recall = hits + miss > 0 ? hits / (hits + miss) : null;
  const f1 = precision !== null && recall !== null && precision + recall > 0 ? 2 * precision * recall / (precision + recall) : null;
  const far = hits + fa > 0 ? fa / (hits + fa) : null;
  const missRate = hits + miss > 0 ? miss / (hits + miss) : null;

  const edges = [0, 0.2, 0.4, 0.6, 0.8, 1.0001];
  const bins: ReliabilityBin[] = [];
  let rel = 0;
  for (let b = 0; b < 5; b++) {
    const ks = probs.map((p, k) => p >= edges[b] && p < edges[b + 1] ? k : -1).filter((k) => k >= 0);
    if (!ks.length) continue;
    const pf = mean(ks.map((k) => probs[k]));
    const po = mean(ks.map((k) => obs[k]));
    rel += ks.length * (pf - po) ** 2;
    bins.push({ bin: `${edges[b].toFixed(1)}–${Math.min(1, edges[b + 1]).toFixed(1)}`, forecast: pf, observed: po, count: ks.length });
  }
  return { mae, rmse, bias, crps, brier, precision, recall, f1, far, missRate, reliability: rel / Math.max(1, probs.length), bins };
}

export function skillScore(m: MetricSet, ref: MetricSet): number {
  const mse = m.rmse ** 2;
  const mseRef = ref.rmse ** 2;
  return mseRef > 0 ? 1 - mse / mseRef : 0;
}

export function rollingMae(f: number[], y: number[], from: number, segments: number) {
  const len = y.length - from;
  const size = Math.max(1, Math.floor(len / segments));
  return Array.from({ length: segments }, (_, k) => {
    const a = from + k * size;
    const b = k === segments - 1 ? y.length : a + size;
    return maeOf(f, y, a, b);
  });
}