// features/packager/components/OrderDetailModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { PackagerOrder } from '../types/packager';
import { COUNTDOWN_DURATION } from '../constants/countdown';

interface OrderDetailModalProps {
  isOpen: boolean;
  order: PackagerOrder | null;
  onComplete: () => void;
  onClose: () => void;
}

export default function OrderDetailModal({
  isOpen,
  order,
  onComplete,
  onClose
}: OrderDetailModalProps) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const created = new Date(order.createdAt).getTime();
      const elapsed = Math.floor((now - created) / 1000);
      const remaining = Math.max(0, COUNTDOWN_DURATION - elapsed);
      setRemainingTime(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  if (!isOpen || !order) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyLevel = (seconds: number) => {
    if (seconds < 180) return 'urgent';
    if (seconds < 360) return 'warning';
    return 'normal';
  };

  const urgency = getUrgencyLevel(remainingTime);

  const headerColors = {
    urgent: 'bg-red-300',
    warning: 'bg-yellow-300',
    normal: 'bg-green-300'
  };

  const timeColors = {
    urgent: 'text-red-800',
    warning: 'text-yellow-800',
    normal: 'text-green-800'
  };

  const buttonColors = {
    urgent: 'bg-red-800 hover:bg-red-900',
    warning: 'bg-yellow-700 hover:bg-yellow-800',
    normal: 'bg-green-700 hover:bg-green-800'
  };

  return (
    <div 
      className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${headerColors[urgency]} px-6 py-4 flex items-center justify-between flex-shrink-0`}>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{order.orderCode}</h3>
            <p className="text-sm text-gray-700 mt-1">
              {order.orderTime}, {order.orderType}
            </p>
          </div>
          <div className={`text-5xl font-black ${timeColors[urgency]}`}>
            {formatTime(remainingTime)}
          </div>
        </div>

        {/* Items List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Detail Pesanan ({order.items.length} items)
          </h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
              >
                <div className="font-semibold text-gray-800 text-lg">
                  {item.quantity} x {item.itemName} ({item.itemCode})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Tutup
          </button>
          <button
            onClick={onComplete}
            className={`flex-1 ${buttonColors[urgency]} text-white font-bold py-4 rounded-xl transition-colors text-lg`}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

