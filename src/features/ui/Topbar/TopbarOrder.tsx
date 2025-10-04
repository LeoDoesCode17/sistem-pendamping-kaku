// features/ui/Topbar/TopbarOrder.tsx
'use client';

import Time from '@/features/ui/Clock';
import { LogOut } from 'lucide-react';

export default function TopbarOrder({ orderType }: { orderType: string }) {
  return (
    <div className="bg-maroon px-6 py-3 flex justify-between items-center shadow-lg">
      <button className="text-cream" aria-label="Logout">
        <LogOut />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-cream text-lg sm:text-xl font-bold tracking-wide">Kaku Food</h1>
        <div className="bg-[#992B1D] text-cream rounded-xl border-2 border-cream px-4 py-1 text-sm sm:text-lg font-bold mt-1">
          {orderType}
        </div>
      </div>

      <Time />
    </div>
  );
}
