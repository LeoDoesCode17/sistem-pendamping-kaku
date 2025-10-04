// features/ui/Topbar/TopbarOrder.tsx
'use client';

import Time from '@/features/ui/Clock';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopbarOrder({ orderType }: { orderType: string }) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/cashier/type-order'); 
  };

  return (
    <div className="bg-maroon px-8 py-2 flex justify-between items-center shadow-lg">
      <button
        className="text-cream"
        aria-label="Back"
        onClick={handleBack}
      >
        <ArrowLeft />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-cream text-lg sm:text-xl font-bold tracking-wide">Kaku Food</h1>
        <div className="bg-maroon2 text-cream rounded-xl border-2 border-cream px-4 py-px text-sm sm:text-lg font-bold">
          {orderType}
        </div>
      </div>

      <Time />
    </div>
  );
}
