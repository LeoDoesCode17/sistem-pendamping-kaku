'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';

export default function SessionBridge() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const sync = async () => {
      try {
        if (user) {
          await fetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.id,
              role: user.role,            // "CASHIER" | "CHEF" | "PACKAGER"
              outletId: user.outlet?.id,  // tetap dikirim walau Opsi A tak pakai di URL
            }),
            cache: 'no-store',
          });
        } else {
          await fetch('/api/session', { method: 'DELETE', cache: 'no-store' });
        }
      } catch (e) {
        console.error('Session sync failed', e);
      }
    };

    sync();
  }, [user, loading]);

  return null;
}
