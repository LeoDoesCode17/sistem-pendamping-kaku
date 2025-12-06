// features/chef/components/OrderedMenuListItem.tsx
"use client";

import { OrderedMenu } from "@/models/ordered-menu";
import { useEffect, useState } from "react";
import { Check } from 'lucide-react';

interface OrderedMenuListItemProps {
  orderedMenu: OrderedMenu;
  index: number;
  onComplete: (orderedMenuId: string) => void;
}

export default function OrderedMenuListItem({
  orderedMenu,
  index,
  onComplete,
}: OrderedMenuListItemProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(orderedMenu.timeCreated!).getTime();
      const diff = Math.floor((now - start) / 1000);
      setElapsedTime(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [orderedMenu.timeCreated]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (seconds: number) => {
    if (seconds < 180) return 'text-green-600';
    if (seconds < 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBorderColor = (seconds: number) => {
    if (seconds < 180) return 'border-green-600';
    if (seconds < 300) return 'border-yellow-600';
    return 'border-red-600';
  };

  return (
    <div className={`bg-gray-200 rounded-lg px-4 py-2 flex items-center justify-between gap-6 border-3 ${getBorderColor(elapsedTime)}`}>
      <span className="text-sm font-semibold text-gray-800 truncate flex-shrink-0">
        {orderedMenu.quantity} x {orderedMenu.menu.name}
      </span>
      
      <span className={`text-base font-bold ${getTimeColor(elapsedTime)} flex-shrink-0`}>
        {formatTime(elapsedTime)}
      </span>
      
      <button
        onClick={() => onComplete(orderedMenu.id!)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1  rounded-lg flex items-center gap-2 transition-colors flex-shrink-0 text-sm"
      >
        <Check className="w-5 h-5" />
        selesai
      </button>
    </div>
  );
}