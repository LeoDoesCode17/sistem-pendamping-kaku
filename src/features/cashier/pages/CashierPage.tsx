'use client';

import { useEffect, useTransition } from 'react';
import { FileEdit, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RippleButton from '@/features/ui/Button/RippleButton';

export default function CashierPage() {
  const router = useRouter();
  const [isPending1, startTransition1] = useTransition();
  const [isPending2, startTransition2] = useTransition();

  // Prefetch rute tujuan biar klik terasa instan
  useEffect(() => {
    router.prefetch('/cashier/type-order');
    router.prefetch('/cashier/riwayat-pesanan');
  }, [router]);

  const handleCatatPesanan = () => {
    if (isPending1) return;
    startTransition1(() => router.push('/cashier/type-order'));
  };

  const handleRiwayatPesanan = () => {
    if (isPending2) return;
    startTransition2(() => router.push('/cashier/riwayat-pesanan'));
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10 md:mt-12">
          
          {/* Catat Pesanan */}
          <RippleButton
            onClick={handleCatatPesanan}
            disabled={isPending1}
            rippleColorClass="bg-white/30"
            surfaceClassName={[
              // surface tombol besar
              'bg-maroon rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl',
              // efek hover/active halus + tactile sudah ada dari base
              'transition-all',
              // full card layout
              'w-full flex flex-col items-center justify-center',
              'min-h-[250px] sm:min-h-[300px] md:min-h-[400px]',
            ].join(' ')}
          >
            <div className="bg-maroon2 rounded-full p-8 sm:p-12 md:p-16 mb-6 transition-all duration-300">
              <FileEdit
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-cream"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-cream text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
              {isPending1 ? 'Membuka…' : 'Catat Pesanan'}
            </h2>
          </RippleButton>

          {/* Riwayat Pesanan */}
          <RippleButton
            onClick={handleRiwayatPesanan}
            disabled={isPending2}
            rippleColorClass="bg-white/30"
            surfaceClassName={[
              'bg-maroon rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl',
              'transition-all',
              'w-full flex flex-col items-center justify-center',
              'min-h-[250px] sm:min-h-[300px] md:min-h-[400px]',
            ].join(' ')}
          >
            <div className="bg-maroon2 rounded-full p-8 sm:p-12 md:p-16 mb-6 transition-all duration-300">
              <Receipt
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-cream"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-cream text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
              {isPending2 ? 'Membuka…' : 'Riwayat Pesanan'}
            </h2>
          </RippleButton>

        </div>
      </div>
    </div>
  );
}
