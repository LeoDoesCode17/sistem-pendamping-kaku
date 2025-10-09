'use client';

import { FileEdit, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CashierPage() {
  const router = useRouter();

  const handleCatatPesanan = () => {
    router.push('/cashier/type-order');
  };

  const handleRiwayatPesanan = () => {
    router.push('/cashier/riwayat-pesanan');
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10 md:mt-12">
          
          {/* Catat Pesanan */}
          <button
            onClick={handleCatatPesanan}
            className="bg-maroon rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] md:min-h-[400px] transition-all"
          >
            <div className="bg-maroon2 rounded-full p-8 sm:p-12 md:p-16 mb-6 transition-all duration-300">
              <FileEdit className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-cream" strokeWidth={1.5} />
            </div>
            <h2 className="text-cream text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
              Catat Pesanan
            </h2>
          </button>

          {/* Riwayat Pesanan */}
          <button
            onClick={handleRiwayatPesanan}
            className="bg-maroon rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] md:min-h-[400px] transition-all"
          >
            <div className="bg-maroon2 rounded-full p-8 sm:p-12 md:p-16 mb-6 transition-all duration-300">
              <Receipt className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-cream" strokeWidth={1.5} />
            </div>
            <h2 className="text-cream text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
              Riwayat Pesanan
            </h2>
          </button>

        </div>
      </div>
    </div>
  );
}
