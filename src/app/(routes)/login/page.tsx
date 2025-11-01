// src/app/(routes)/login/page.tsx
import { Suspense } from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

// Opsi tambahan untuk mencegah prerender error saat build
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="flex h-full items-center justify-center px-4">
        <Suspense fallback={<div />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
