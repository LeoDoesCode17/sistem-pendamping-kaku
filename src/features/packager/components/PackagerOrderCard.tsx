// features/packager/components/PackagerOrderCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { PackagerOrder } from '../types/packager';
import { COUNTDOWN_DURATION, MAX_PREVIEW_ITEMS } from '../constants/countdown';

interface PackagerOrderCardProps {
  order: PackagerOrder;
  onClick: (order: PackagerOrder) => void;
}

export default function PackagerOrderCard({ order, onClick }: PackagerOrderCardProps) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const created = new Date(order.createdAt).getTime();
      const elapsed = Math.floor((now - created) / 1000);
      const remaining = Math.max(0, COUNTDOWN_DURATION - elapsed);
      setRemainingTime(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyLevel = (seconds: number) => {
    if (seconds < 180) return 'urgent'; // < 3 menit - Merah
    if (seconds < 360) return 'warning'; // 3-6 menit - Kuning
    return 'normal'; // > 6 menit - Hijau
  };

  const urgency = getUrgencyLevel(remainingTime);

  const cardColors = {
    urgent: 'bg-red-300 border-red-400',
    warning: 'bg-yellow-300 border-yellow-400',
    normal: 'bg-green-300 border-green-400'
  };

  const timeColors = {
    urgent: 'text-red-800',
    warning: 'text-yellow-800',
    normal: 'text-green-800'
  };

  const previewItems = order.items.slice(0, MAX_PREVIEW_ITEMS);
  const remainingItemsCount = order.items.length - MAX_PREVIEW_ITEMS;
  const hasMore = remainingItemsCount > 0;

  return (
    <button
      onClick={() => onClick(order)}
      className={`${cardColors[urgency]} rounded-2xl shadow-xl border-4 overflow-hidden text-left w-full hover:shadow-2xl transition-all hover:scale-[1.02] flex flex-col min-h-[280px]`}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{order.orderCode}</h3>
          <p className="text-sm text-gray-700">
            {order.orderTime}, {order.orderType}
          </p>
        </div>
        <div className={`text-4xl font-black ${timeColors[urgency]}`}>
          {formatTime(remainingTime)}
        </div>
      </div>

      {/* Items Preview (Max 3) */}
      <div className="bg-white mx-4 mb-4 rounded-lg flex-shrink-0">
        {previewItems.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b last:border-b-0 border-gray-200"
          >
            <div className="font-semibold text-gray-800">
              {item.quantity} x {item.itemName} ({item.itemCode})
            </div>
          </div>
        ))}
        
        {/* Show "... X items lagi" jika lebih dari 3 */}
        {hasMore && (
          <div className="px-4 py-3 text-center bg-gray-50">
            <span className="text-gray-600 font-semibold">
              ... {remainingItemsCount} item lagi
            </span>
          </div>
        )}
      </div>

      {/* Spacer - untuk push konten ke atas */}
      <div className="flex-grow"></div>
    </button>
  );
}