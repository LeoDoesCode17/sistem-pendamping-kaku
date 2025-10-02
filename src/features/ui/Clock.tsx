'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Time() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className='flex items-center gap-3 bg-[#992B1D] px-3 py-1 rounded-xl border-2 border-cream'>
      <div className="text-[#F7D692] flex items-center gap-2">
        <Clock></Clock>
        <div className="text-2xl font-bold">{timeString}</div>
      </div>
    </div>

  );
}