import React, { useMemo, useRef, useState } from 'react';
import type { LocationInfo } from '../../types/forecast';
import { GRID } from '../../utils/forecast';
import { cn } from '../../utils/cn';

interface TooltipContent {
  title: string;
  lines: {label: string;value: string;}[];
}

interface FieldGridProps {
  fills: string[][];
  tooltip: (r: number, c: number) => TooltipContent;
  markers?: LocationInfo[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  ariaLabel: string;
  className?: string;
}

const CELL = 20;
const PAD_L = 30;
const PAD_B = 22;
const W = GRID.cols * CELL;
const H = GRID.rows * CELL;
const VBW = PAD_L + W + 6;
const VBH = H + PAD_B;

const x = (lon: number) => PAD_L + (lon - GRID.lonMin) / (GRID.lonMax - GRID.lonMin) * W;
const y = (lat: number) => (GRID.latMax - lat) / (GRID.latMax - GRID.latMin) * H;

export function FieldGrid({ fills, tooltip, markers = [], selectedId, onSelect, ariaLabel, className }: FieldGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{r: number;c: number;xp: number;yp: number;} | null>(null);

  const rects = useMemo(
    () =>
    fills.flatMap((row, r) =>
    row.map((fill, c) => <rect key={`${r}-${c}`} x={PAD_L + c * CELL} y={r * CELL} width={CELL - 0.6} height={CELL - 0.6} fill={fill} />)
    ),
    [fills]
  );

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = (e.clientX - rect.left) / rect.width * VBW;
    const sy = (e.clientY - rect.top) / rect.height * VBH;
    const c = Math.floor((sx - PAD_L) / CELL);
    const r = Math.floor(sy / CELL);
    if (c < 0 || c >= GRID.cols || r < 0 || r >= GRID.rows) {
      setHover(null);
      return;
    }
    setHover({ r, c, xp: (e.clientX - rect.left) / rect.width, yp: (e.clientY - rect.top) / rect.height });
  };

  const tip = hover ? tooltip(hover.r, hover.c) : null;
  const lonTicks = [70, 75, 80, 85, 90, 95];
  const latTicks = [10, 15, 20, 25, 30, 35];

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="block h-auto w-full touch-pan-y select-none"
        role="group"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}>
        
        <rect x={PAD_L} y={0} width={W} height={H} className="fill-surface2" />
        {rects}
        {lonTicks.map((lon) =>
        <g key={lon}>
            <line x1={x(lon)} x2={x(lon)} y1={0} y2={H} className="stroke-fg/10" strokeWidth={0.6} />
            <text x={x(lon)} y={H + 15} textAnchor="middle" className="fill-muted" fontSize={10}>
              {lon}°E
            </text>
          </g>
        )}
        {latTicks.map((lat) =>
        <g key={lat}>
            <line x1={PAD_L} x2={PAD_L + W} y1={y(lat)} y2={y(lat)} className="stroke-fg/10" strokeWidth={0.6} />
            <text x={PAD_L - 5} y={y(lat) + 3} textAnchor="end" className="fill-muted" fontSize={10}>
              {lat}°N
            </text>
          </g>
        )}
        {hover &&
        <rect
          x={PAD_L + hover.c * CELL}
          y={hover.r * CELL}
          width={CELL - 0.6}
          height={CELL - 0.6}
          fill="none"
          className="stroke-fg"
          strokeWidth={1.5}
          pointerEvents="none" />

        }
        {markers.map((m) => {
          const selected = m.id === selectedId;
          return (
            <g
              key={m.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${m.name}`}
              aria-pressed={selected}
              className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-accent"
              onClick={() => onSelect?.(m.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(m.id);
                }
              }}>
              
              <circle cx={x(m.lon)} cy={y(m.lat)} r={selected ? 10 : 7} className={selected ? 'fill-accent/25 stroke-accent' : 'fill-transparent stroke-fg/80'} strokeWidth={selected ? 2.5 : 1.5} />
              <circle cx={x(m.lon)} cy={y(m.lat)} r={2.6} className={selected ? 'fill-accent' : 'fill-fg'} />
              <text
                x={x(m.lon) + 11}
                y={y(m.lat) + 4}
                fontSize={11}
                fontWeight={selected ? 600 : 500}
                className="fill-fg stroke-surface"
                strokeWidth={3}
                style={{ paintOrder: 'stroke' }}>
                
                {m.name}
              </text>
            </g>);

        })}
      </svg>
      {tip && hover &&
      <div
        className="pointer-events-none absolute z-10 w-48 rounded-xl border border-line bg-surface/95 p-3 text-xs shadow-xl backdrop-blur"
        style={{
          left: `${hover.xp * 100}%`,
          top: `${hover.yp * 100}%`,
          transform: `translate(${hover.xp > 0.6 ? 'calc(-100% - 12px)' : '12px'}, ${hover.yp > 0.6 ? 'calc(-100% - 12px)' : '12px'})`
        }}
        role="tooltip">
        
          <p className="font-medium text-fg">{tip.title}</p>
          <dl className="mt-1.5 space-y-0.5">
            {tip.lines.map((l) =>
          <div key={l.label} className="flex justify-between gap-3">
                <dt className="text-muted">{l.label}</dt>
                <dd className="font-mono text-fg">{l.value}</dd>
              </div>
          )}
          </dl>
        </div>
      }
    </div>);

}