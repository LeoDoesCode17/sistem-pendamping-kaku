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

  const getBorderColor = (seconds: number) => {
    if (seconds < 180) return 'border-green-500'; // < 3 menit
    if (seconds < 300) return 'border-yellow-500'; // 3-5 menit
    return 'border-red-500'; // > 5 menit
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 border-4 ${getBorderColor(elapsedTime)} hover:shadow-2xl transition-shadow`}>
      <div className="flex flex-col items-center mb-6">
        <div className="text-3xl font-bold text-gray-800 mb-2">
          1 x ({order.orderCode})
        </div>
        <div className={`text-6xl font-black ${getTimeColor(elapsedTime)}`}>
          {formatTime(elapsedTime)}
        </div>
      </div>
      <button
        onClick={() => onComplete(order.id)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 transition-colors text-xl shadow-lg"
      >
        <Check className="w-8 h-8 stroke-[3]" />
        SELESAI
      </button>
    </div>
  );
}