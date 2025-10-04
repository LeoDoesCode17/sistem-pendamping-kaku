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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Catat Pesanan Button */}
          <button
            onClick={handleCatatPesanan}
            className="bg-maroon rounded-2xl p-12 shadow-2xl  flex flex-col items-center justify-center min-h-[400px] group"
          >
            <div className="bg-gray-200 rounded-full p-16 mb-8 group-hover:bg-white transition-colors duration-300">
              <FileEdit className="w-32 h-32 text-red-900" strokeWidth={1.5} />
            </div>
            <h2 className="text-yellow-100 text-4xl font-bold tracking-wide">
              Catat Pesanan
            </h2>
          </button>

          {/* Riwayat Pesanan Button */}
          <button
            onClick={handleRiwayatPesanan}
            className="bg-maroon rounded-2xl p-12 shadow-2xl  flex flex-col items-center justify-center min-h-[400px] group"
          >
            <div className="bg-gray-200 rounded-full p-16 mb-8 group-hover:bg-white transition-colors duration-300">
              <Receipt className="w-32 h-32 text-red-900" strokeWidth={1.5} />
            </div>
            <h2 className="text-yellow-100 text-4xl font-bold tracking-wide">
              Riwayat Pesanan
            </h2>
          </button>
        </div>
      </div>
    </div>
  );
}