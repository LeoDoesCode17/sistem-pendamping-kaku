// features/orders/components/AlertNotification.tsx
'use client';

import { useEffect } from 'react';
import React from 'react';

type AlertType = 'success' | 'warning' | 'error' | 'info';

const cls: Record<AlertType, string> = {
  success: 'bg-green-100 border-green-300 text-green-800',
  warning: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  error:   'bg-red-100 border-red-300 text-red-800',
  info:    'bg-blue-100 border-blue-300 text-blue-800',
};

export default function AlertNotification({
  type,
  message,
  onClose,
  autoHideMs = 2600,
}: {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoHideMs?: number;
}) {
  useEffect(() => {
    if (!autoHideMs) return;
    const t = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onClose]);

  return (
    <div
      role="alert"
      className={`fixed z-[100] bottom-6 left-1/2 -translate-x-1/2 w-[min(92vw,640px)] border rounded-xl px-4 py-3 shadow-lg ${cls[type]}`}
    >
      <div className="flex items-start gap-3">
        <span className="font-semibold capitalize">{type}</span>
        <p className="flex-1">{message}</p>
        <button
          aria-label="Tutup"
          className="opacity-70 hover:opacity-100"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
