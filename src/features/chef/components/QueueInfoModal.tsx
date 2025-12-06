// features/chef/components/QueueInfoModal.tsx
"use client";

import { OrderedMenu } from "@/models/ordered-menu";
import { X } from 'lucide-react';

interface QueueInfoModalProps {
  isOpen: boolean;
  queuedMenus: OrderedMenu[];
  onClose: () => void;
}

export default function QueueInfoModal({
  isOpen,
  queuedMenus,
  onClose
}: QueueInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Antrian Selanjutnya ({queuedMenus.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        
        <div className="space-y-3">
          {queuedMenus.map((menu, idx) => (
            <div 
              key={menu.id} 
              className="bg-gray-100 rounded-lg p-4 flex items-center gap-4"
            >
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  {menu.quantity} x {menu.menu.name}
                </p>
                {menu.customize && (
                  <p className="text-sm text-gray-600 mt-1">
                    Catatan: {menu.customize}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition-colors text-lg"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}