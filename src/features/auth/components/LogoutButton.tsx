'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth/hooks/useLogout';
import ConfirmModal from '@/features/ui/Modal/ConfirmModal';
import RippleButton from '@/features/ui/Button/RippleButton';

export default function LogoutButton({
  className = 'text-cream',
  ariaLabel = 'Logout',
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const { logout, loading } = useLogout();
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await logout(); // signOut + DELETE /api/session + redirect
  };

  return (
    <>
      <RippleButton
        aria-label={ariaLabel}
        title="Logout"
        disabled={loading}
        onClick={() => setOpen(true)}
        className={className}
        // surface default sudah cocok untuk maroon; bisa override via surfaceClassName kalau perlu
      >
        <LogOut />
      </RippleButton>

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
