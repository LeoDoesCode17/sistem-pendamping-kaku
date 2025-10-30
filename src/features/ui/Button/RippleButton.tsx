'use client';

import React, { forwardRef, useRef, useState } from 'react';

type Ripple = { id: number; x: number; y: number };

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Getar mini saat tap (default: true) */
  vibrate?: boolean;
  /** Kelas warna ripple (default: bg-cream/40) */
  rippleColorClass?: string;
  /** Tambahan kelas untuk surface (bg/hover/active) jika mau override */
  surfaceClassName?: string;
};

const RippleButton = forwardRef<HTMLButtonElement, Props>(function RippleButton(
  {
    className = '',
    surfaceClassName,
    rippleColorClass = 'bg-cream/40',
    vibrate = true,
    onPointerDown,
    disabled,
    children,
    ...rest
  },
  ref
) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  const spawnRipple = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 450);

    if (vibrate && navigator.vibrate) navigator.vibrate(8);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    spawnRipple(e);
    onPointerDown?.(e);
  };

  return (
    <>
      <button
        ref={(node) => {
          btnRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        onPointerDown={handlePointerDown}
        disabled={disabled}
        className={[
          // Surface + tactile
          'relative overflow-hidden select-none',
          'min-h-[44px] min-w-[44px] rounded-xl',
          'transition-transform active:scale-[0.96]',
          'focus:outline-none focus:ring-2 focus:ring-white/40',
          'disabled:opacity-60',
          // default surface (kontras di maroon); bisa di-override via surfaceClassName
          surfaceClassName ?? ' hover:bg-white/15 active:bg-white/25 p-2',
          className,
        ].join(' ')}
        {...rest}
      >
        {children}

        {/* Ripple layer */}
        <span className="pointer-events-none absolute inset-0">
          {ripples.map((r) => (
            <span
              key={r.id}
              className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${rippleColorClass} animate-[ripple_450ms_ease-out]`}
              style={{ left: r.x, top: r.y }}
            />
          ))}
        </span>
      </button>

      {/* Global keyframes (aman kalau ke-render beberapa kali) */}
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
        @media (prefers-reduced-motion: reduce) {
          [class*='animate-[ripple_'] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
});

export default RippleButton;
