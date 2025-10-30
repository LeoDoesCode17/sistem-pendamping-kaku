// features/ui/Button/IconBackButton.tsx
'use client';

import { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Ripple = { id: number; x: number; y: number };

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
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const spawnRipple = (e: React.MouseEvent | React.TouchEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clientX =
      'touches' in e && e.touches.length ? e.touches[0].clientX : (e as any).clientX;
    const clientY =
      'touches' in e && e.touches.length ? e.touches[0].clientY : (e as any).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 450);
  };

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    spawnRipple(e);
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => {
      if (backPath) router.push(backPath);
      else router.back();
    }, 120);
  };

  return (
    <>
      <button
        ref={btnRef}
        aria-label={ariaLabel}
        onMouseDown={handleTap as any}
        onTouchStart={handleTap as any}
        className={[
          'relative overflow-hidden select-none',
          'min-h-[44px] min-w-[44px]',
          'rounded-xl p-2',
          ' hover:bg-white/15 active:bg-white/25',
          'transition-transform active:scale-[0.96]',
          'focus:outline-none focus:ring-2 focus:ring-white/40',
          className,
        ].join(' ')}
      >
        <ArrowLeft />

        {/* Ripple Layer */}
        <span className="pointer-events-none absolute inset-0">
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream/40 animate-[ripple_450ms_ease-out]"
              style={{ left: r.x, top: r.y }}
            />
          ))}
        </span>
      </button>

      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(12);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
