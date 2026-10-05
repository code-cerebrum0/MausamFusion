import type { MethodId, SourceId } from '../types/forecast';

export type Theme = 'dark' | 'light';

export interface Palette {
  accent: string;
  fg: string;
  muted: string;
  line: string;
  surface: string;
  surface2: string;
  danger: string;
  success: string;
  warn: string;
  sources: Record<SourceId, string>;
  methods: Record<MethodId, string>;
}

export const palettes: Record<Theme, Palette> = {
  dark: {
    accent: '#38bdf8',
    fg: '#e6ecf5',
    muted: '#98a4ba',
    line: '#242e42',
    surface: '#0d1320',
    surface2: '#141c2d',
    danger: '#f87171',
    success: '#34d399',
    warn: '#fbbf24',
    sources: { nwp: '#818cf8', ensemble: '#f5b342', ai: '#2dd4bf' },
    methods: { best: '#94a3b8', equal: '#e879a9', fixed: '#fb923c', skill: '#a3e635', fusion: '#38bdf8' }
  },
  light: {
    accent: '#0369a1',
    fg: '#0c1220',
    muted: '#4e5c73',
    line: '#dce2ec',
    surface: '#ffffff',
    surface2: '#f0f3f8',
    danger: '#c81e1e',
    success: '#047857',
    warn: '#9a3412',
    sources: { nwp: '#4f46e5', ensemble: '#d97706', ai: '#0d9488' },
    methods: { best: '#64748b', equal: '#be185d', fixed: '#c2410c', skill: '#4d7c0f', fusion: '#0369a1' }
  }
};

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function chartStyles(p: Palette) {
  return {
    grid: p.line,
    tick: { fill: p.muted, fontSize: 11 },
    tooltip: {
      contentStyle: {
        background: p.surface,
        border: `1px solid ${p.line}`,
        borderRadius: 12,
        color: p.fg,
        fontSize: 12,
        boxShadow: '0 8px 24px -12px rgba(0,0,0,0.35)'
      },
      labelStyle: { color: p.fg, fontWeight: 600, marginBottom: 4 },
      itemStyle: { color: p.fg, padding: 0 }
    }
  };
}