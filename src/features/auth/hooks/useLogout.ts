'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export function useLogout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // 1) Firebase sign out + clear localStorage (sudah di AuthProvider)
      await signOut();
      // 2) Pastikan cookie app_session langsung dibersihkan (defensif)
      await fetch('/api/session', { method: 'DELETE', cache: 'no-store' }).catch(() => {});
      // 3) Redirect ke login
      router.replace('/login');
    } catch (e) {
      console.error('Logout failed', e);
      setLoading(false);
      throw e;
    }
  };

  return { logout, loading };
}
