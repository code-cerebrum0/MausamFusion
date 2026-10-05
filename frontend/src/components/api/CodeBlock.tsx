import React from 'react';
import { CopyButton } from '../ui/CopyButton';

interface CodeBlockProps {
  label: string;
  code: string;
}

export function CodeBlock({ label, code }: CodeBlockProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-line bg-surface2">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.5">
        <span className="text-xs font-medium text-muted">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap break-words p-3 font-mono text-[12px] leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
    </div>);

}