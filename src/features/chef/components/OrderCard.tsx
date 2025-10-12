// features/chef/components/OrderCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { ChefOrder } from '../types/chef';

interface OrderCardProps {
  order: ChefOrder;
  onComplete: (orderId: string) => void;
}

export default function OrderCard({ order, onComplete }: OrderCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(order.startTime).getTime();
      const diff = Math.floor((now - start) / 1000); // dalam detik
      setElapsedTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (seconds: number) => {
    if (seconds < 180) return 'text-green-600'; // < 3 menit
    if (seconds < 300) return 'text-yellow-600'; // 3-5 menit
    return 'text-red-600'; // > 5 menit
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between border-2 border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-lg font-semibold text-gray-800 min-w-[80px]">
          1 x ({order.orderCode})
        </div>
        <div className={`text-2xl font-bold ${getTimeColor(elapsedTime)}`}>
          {formatTime(elapsedTime)}
        </div>
      </div>

      <button
        onClick={() => onComplete(order.id)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-colors"
        aria-label="Selesai"
      >
        <Check className="w-6 h-6" />
      </button>
    </div>
  );
}
