'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  open,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmLabel = 'Ya',
  cancelLabel = 'Batal',
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  // close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 text-gray-700">{message}</div>

        <div className="flex justify-end gap-2 border-t px-5 py-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-white disabled:opacity-60 ${
              danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-maroon hover:bg-maroon2'
            }`}
          >
            {loading ? 'Memproses…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
