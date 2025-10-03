"use client";

import Time from '@/features/ui/Clock'
import { LogOut } from 'lucide-react';


export default function TopbarOrder({ orderType }: { orderType: "Grab Food" | "Go Food" | "Shopee Food" | "Wa Order" | "Dine In" | "Take Away" }) {
  return (
    <div className="bg-maroon px-8 py-2 flex justify-between items-center shadow-lg">
      <button className='text-cream'>
        <LogOut></LogOut>
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-cream text-xl font-bold tracking-wide">Kaku Food</h1>
        <div className="bg-[#992B1D] text-cream rounded-xl border-2 border-cream px-4 py-px  text-lg font-bold">
          {orderType}
        </div>
      </div>

      <Time />
    </div>
  );
}