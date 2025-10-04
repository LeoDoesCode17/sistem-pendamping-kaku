'use client';

import Time from '@/features/ui/Clock'

export default function TopBarLogin() {

  return (
    <div className="bg-maroon px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-cream text-3xl font-bold tracking-wide">Kaku Food</h1>
      <Time></Time>
    </div>
  );
}