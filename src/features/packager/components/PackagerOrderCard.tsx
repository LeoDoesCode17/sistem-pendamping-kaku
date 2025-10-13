// features/packager/components/PackagerOrderCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { PackagerOrder } from '../types/packager';
import { COUNTDOWN_DURATION } from '../constants/countdown';

interface PackagerOrderCardProps {
  order: PackagerOrder;
  onComplete: (orderId: string) => void;
}

export default function PackagerOrderCard({ order, onComplete }: PackagerOrderCardProps) {
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

  const buttonColors = {
    urgent: 'bg-red-800 hover:bg-red-900',
    warning: 'bg-yellow-700 hover:bg-yellow-800',
    normal: 'bg-green-700 hover:bg-green-800'
  };

  return (
    <div className={`${cardColors[urgency]} rounded-2xl shadow-xl border-4 overflow-hidden`}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
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

      {/* Items List */}
      <div className="bg-white mx-4 mb-4 rounded-lg">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b last:border-b-0 border-gray-200"
          >
            <div className="font-semibold text-gray-800">
              {item.quantity} x {item.itemName} ({item.itemCode})
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onComplete(order.id)}
          className={`w-full ${buttonColors[urgency]} text-white font-bold py-3 rounded-lg transition-colors text-lg`}
        >
          Selesai
        </button>
      </div>
    </div>
  );
}