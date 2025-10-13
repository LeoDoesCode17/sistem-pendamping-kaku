// features/ui/Topbar/TopbarMain.tsx
"use client";

import Time from '@/features/ui/Clock'
import { LogOut, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopbarMainProps {
  pageType: "Kasir" | "Chef" | "Packager";
  showBackButton?: boolean;
  backPath?: string;
}

export default function TopbarMain({ 
  pageType, 
  showBackButton = false,
  backPath
}: TopbarMainProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-maroon px-8 py-4 flex justify-between items-center shadow-lg relative">
      <button 
        className="text-cream z-10"
        aria-label={showBackButton ? "Back" : "Logout"}
        onClick={showBackButton ? handleBack : handleLogout}
      >
        {showBackButton ? <ArrowLeft /> : <LogOut />}
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h1 className="text-cream text-xl font-bold tracking-wide">Kaku Food</h1>
        <div className="bg-maroon2 text-cream rounded-xl border-2 border-cream px-4 py-px text-lg font-bold">
          {pageType}
        </div>
      </div>

      <Time />
    </div>
  );
}