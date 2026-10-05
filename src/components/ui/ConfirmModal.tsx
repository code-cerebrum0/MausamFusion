import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  loading,
  onConfirm,
  onCancel,
  children
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} description={description} size="sm">
      {children && <div className="px-5 pt-4 text-sm text-muted">{children}</div>}
      <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading} data-autofocus>
          {confirmLabel}
        </Button>
      </div>
    </Modal>);

}