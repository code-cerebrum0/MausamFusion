import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeftIcon, SearchIcon } from 'lucide-react';
import { searchIndex } from '../../data/searchIndex';
import { cn } from '../../utils/cn';
import { Modal } from '../ui/Modal';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 8);
    const terms = q.split(/\s+/);
    return searchIndex.
    map((e) => {
      const hay = `${e.title} ${e.section} ${e.description} ${e.keywords}`.toLowerCase();
      const score = terms.reduce((s, t) => hay.includes(t) ? s + (e.title.toLowerCase().includes(t) ? 3 : 1) : s - 100, 0);
      return { e, score };
    }).
    filter((r) => r.score > 0).
    sort((a, b) => b.score - a.score).
    map((r) => r.e);
  }, [query]);

  useEffect(() => setActive(0), [query]);

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active].to);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Search MausamFusion" hideTitle position="top" size="lg">
      <div className="flex items-center gap-3 border-b border-line px-4">
        <SearchIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          data-autofocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search pages, sections and endpoints…"
          className="h-14 w-full min-w-0 bg-transparent text-base text-fg placeholder:text-muted focus:outline-none"
          aria-label="Search query"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `sr-${active}` : undefined} />
        
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">ESC</kbd>
      </div>
      <ul id="search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2" aria-label="Search results">
        {results.length === 0 &&
        <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{query}”. Try “weights”, “calibration” or “API”.</li>
        }
        {results.map((r, i) =>
        <li key={r.to} id={`sr-${i}`} role="option" aria-selected={i === active}>
            <button
            type="button"
            onMouseEnter={() => setActive(i)}
            onClick={() => go(r.to)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-[background-color] duration-100',
              i === active ? 'bg-surface2' : 'hover:bg-surface2/60'
            )}>
            
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{r.title}</p>
                <p className="truncate text-xs text-muted">{r.description}</p>
              </div>
              <span className="hidden shrink-0 text-xs text-muted sm:inline">{r.section}</span>
              {i === active && <CornerDownLeftIcon className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />}
            </button>
          </li>
        )}
      </ul>
    </Modal>);

}