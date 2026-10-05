import React, { useEffect, useState } from 'react';
import { CheckIcon, CopyIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { copyText } from '../../utils/clipboard';
import { cn } from '../../utils/cn';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = 'Copy', className }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const t = window.setTimeout(() => setState('idle'), 1800);
    return () => window.clearTimeout(t);
  }, [state]);

  const onCopy = async () => {
    try {
      await copyText(text);
      setState('copied');
      toast.success('Copied to clipboard');
    } catch {
      setState('error');
      toast.error('Could not copy. Select the text and copy manually.');
    }
  };

  const Icon = state === 'copied' ? CheckIcon : state === 'error' ? XIcon : CopyIcon;
  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-muted transition-[background-color,color,border-color] duration-150 hover:border-muted/40 hover:text-fg',
        state === 'copied' && 'text-success',
        state === 'error' && 'text-danger',
        className
      )}
      aria-label={state === 'copied' ? 'Copied' : `${label} to clipboard`}>
      
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{state === 'copied' ? 'Copied' : state === 'error' ? 'Failed' : label}</span>
    </button>);

}