// features/chef/components/ConfirmationModal.tsx
'use client';

interface ConfirmationModalProps {
  isOpen: boolean;
  orderCode: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  orderCode,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Konfirmasi Selesai
        </h2>
        <p className="text-gray-600 mb-6">
          Apakah pesanan <span className="font-semibold">({orderCode})</span> sudah selesai dimasak?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Ya, Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
