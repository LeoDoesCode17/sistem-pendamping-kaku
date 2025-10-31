// features/auth/hooks/useLogout.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export function useLogout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    if (loading) return;            // cegah double-tap
    setLoading(true);
    try {
      // 1) Bersihkan cookie session di server (role, outletId, dll)
      await fetch('/api/session/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      // 2) Firebase sign out + clear localStorage (handled by AuthProvider)
      await signOut();

      // 3) Redirect ke login & segarkan state app router
      router.replace('/login');
      router.refresh();
      // catatan: tidak perlu setLoading(false) karena halaman akan berubah
    } catch (e) {
      console.error('Logout failed', e);
      setLoading(false);            // balikkan state kalau gagal
      throw e;
    }
  }, [loading, router, signOut]);

  return { logout, loading };
}
