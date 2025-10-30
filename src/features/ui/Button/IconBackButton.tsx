'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RippleButton from '@/features/ui/Button/RippleButton';

interface IconBackButtonProps {
  backPath?: string;
  className?: string;
  ariaLabel?: string;
}

export default function IconBackButton({
  backPath,
  className = 'text-cream',
  ariaLabel = 'Kembali',
}: IconBackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (backPath) router.push(backPath);
    else router.back();
  };

  return (
    <RippleButton
      aria-label={ariaLabel}
      onClick={handleClick}
      className={className}
      // default surface sudah pas untuk topbar maroon
    >
      <ArrowLeft />
    </RippleButton>
  );
}
