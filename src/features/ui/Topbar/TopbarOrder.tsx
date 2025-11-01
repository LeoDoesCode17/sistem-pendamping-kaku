// features/ui/Topbar/TopbarOrder.tsx
'use client';

import Time from '@/features/ui/Clock';
import IconBackButton from '@/features/ui/Button/IconBackButton';

interface TopbarOrderProps {
  orderType: string;
  backPath?: string;
}

export default function TopbarOrder({ orderType, backPath }: TopbarOrderProps) {
  return (
    <header className="relative flex items-center justify-between bg-maroon px-6 sm:px-8 py-3 shadow-lg">
      {/* Left: Back button (reusable ripple) */}
      <IconBackButton backPath={backPath || '/cashier/type-order'} />

      {/* Center: Title */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h1 className="text-cream text-lg sm:text-xl font-bold tracking-wide">Kaku Food</h1>
        <div className="bg-maroon2 text-cream rounded-xl border-2 border-cream px-4 py-px text-sm sm:text-lg font-bold">
          {orderType}
        </div>
      </div>

      {/* Right: Clock */}
      <Time />
    </header>
  );
}
