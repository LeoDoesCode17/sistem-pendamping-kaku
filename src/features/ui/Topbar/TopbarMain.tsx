'use client';

import Time from '@/features/ui/Clock';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/features/auth/components/LogoutButton';

interface TopbarMainProps {
  pageType: 'Kasir' | 'Chef' | 'Packager';
  showBackButton?: boolean;
  backPath?: string;
}

export default function TopbarMain({
  pageType,
  showBackButton = false,
  backPath,
}: TopbarMainProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) router.push(backPath);
    else router.back();
  };

  return (
    <div className="relative flex items-center justify-between bg-maroon px-8 py-4 shadow-lg">
      {/* Left button: Back OR Logout */}
      {showBackButton ? (
        <button
          className="z-10 text-cream"
          aria-label="Back"
          onClick={handleBack}
        >
          <ArrowLeft />
        </button>
      ) : (
        <LogoutButton className="z-10 text-cream" />
      )}

      {/* Center title */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h1 className="text-xl font-bold tracking-wide text-cream">Kaku Food</h1>
        <div className="rounded-xl border-2 border-cream bg-maroon2 px-4 py-px text-lg font-bold text-cream">
          {pageType}
        </div>
      </div>

      {/* Right clock */}
      <Time />
    </div>
  );
}
