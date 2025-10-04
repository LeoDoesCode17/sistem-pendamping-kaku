"use client";

import Time from '@/features/ui/Clock'
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function TopbarMain({ pageType }: { pageType: "Kasir" | "Chef" | "Packager" }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="bg-maroon px-8 py-2 flex justify-between items-center shadow-lg">
      <button className="text-cream"
        aria-label="Back"
        onClick={handleLogout}>
        <LogOut></LogOut>
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-cream text-xl font-bold tracking-wide">Kaku Food</h1>
        <div className="bg-maroon2 text-cream rounded-xl border-2 border-cream px-4 py-px  text-lg font-bold">
          {pageType}
        </div>
      </div>

      <Time />
    </div>
  );
}