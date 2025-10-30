// src/features/auth/components/LogoutButton.tsx
'use client';

import { useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth/hooks/useLogout';
import ConfirmModal from '@/features/ui/Modal/ConfirmModal';

type Ripple = { id: number; x: number; y: number };

export default function LogoutButton({
  className = '',
  ariaLabel = 'Logout',
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const { logout, loading } = useLogout();
  const [open, setOpen] = useState(false);

  // Ripple state
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
    setOpen(true);
  };

  const handleConfirm = async () => {
    await logout(); // signOut + clear cookie + redirect
  };

  return (
    <>
      <button
        ref={btnRef}
        aria-label={ariaLabel}
        title="Logout"
        disabled={loading}
        onMouseDown={handleTap as any}
        onTouchStart={handleTap as any}
        className={[
          // >>>> PERMUKAAN TOMBOL BIAR RIPPLE KELIHATAN <<<<
          'relative overflow-hidden select-none',
          'min-h-[44px] min-w-[44px]',              // target sentuh nyaman
          'rounded-xl p-2',
          // background semi-transparan supaya ripple kelihatan
          'hover:bg-white/15 active:bg-white/25',
          // pressed feedback
          'transition-transform active:scale-[0.96]',
          'focus:outline-none focus:ring-2 focus:ring-white/40',
          'disabled:opacity-60',
          className || 'text-cream',                // default warna ikon
        ].join(' ')}
      >
        <LogOut />

        {/* Ripple layer */}
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

      {/* keyframes ripple — kalau belum kelihatan, pastikan tidak ditimpa CSS lain */}
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

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Keluar dari Akun"
        message={
          <>
            Anda akan keluar dari sesi saat ini.
            <br />
            <span className="text-sm text-gray-500">
              Data yang belum disimpan bisa hilang.
            </span>
          </>
        }
        confirmLabel="Keluar"
        cancelLabel="Batal"
        danger
        loading={loading}
      />
    </>
  );
}
