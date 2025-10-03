'use client';

import { UtensilsCrossed, ShoppingBag, Bike, Package, ShoppingCart, MessageSquare } from 'lucide-react';

interface OrderType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function OrderTypePage() {
  const orderTypes: OrderType[] = [
    { id: 'dine-in', name: 'Dine In', icon: <UtensilsCrossed size={48} /> },
    { id: 'take-away', name: 'Take Away', icon: <ShoppingBag size={48} /> },
    { id: 'go-food', name: 'Go Food', icon: <Bike size={48} /> },
    { id: 'grab-food', name: 'Grab Food', icon: <Package size={48} /> },
    { id: 'shopee-food', name: 'Shopee Food', icon: <ShoppingCart size={48} /> },
    { id: 'wa-order', name: 'Wa Order', icon: <MessageSquare size={48} /> },
  ];

  const handleOrderTypeClick = (type: string) => {
    console.log('Selected order type:', type);
    // Handle navigation or state update here
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <h1 className="text-4xl font-bold text-[#8B0000] text-center mb-12">
        Pilih Tipe Pesanan
      </h1>

      {/* Grid container - BAGIAN YANG MENGATUR LAYOUT KOTAK */}
      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
        {orderTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleOrderTypeClick(type.id)}
            // BAGIAN INI MENGATUR UKURAN DAN STYLING KOTAK
            className="
              bg-[#8B0000] 
              text-white 
              rounded-2xl 
              p-8                    /* Padding dalam kotak */
              min-h-[200px]          /* Tinggi minimum kotak */
              flex 
              flex-col 
              items-center 
              justify-center 
              gap-4 
              hover:bg-[#A52A2A] 
              transition-all 
              duration-200 
              shadow-lg 
              hover:shadow-xl 
              hover:scale-105
            "
          >
            {/* Icon container */}
            <div className="text-white">
              {type.icon}
            </div>
            
            {/* Text */}
            <span className="text-2xl font-bold">
              {type.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* 
PENJELASAN UKURAN KOTAK:
========================

1. Grid Layout (grid grid-cols-3 gap-8):
   - grid-cols-3: 3 kolom per baris
   - gap-8: Jarak antar kotak (2rem / 32px)
   - Ubah gap-8 untuk mengatur jarak antar kotak

2. Ukuran Kotak Individual:
   - min-h-[200px]: Tinggi minimum kotak 200px
     * Ubah angka ini untuk tinggi berbeda (misal: min-h-[250px])
   
   - p-8: Padding dalam kotak (2rem / 32px)
     * Ubah untuk ruang dalam kotak (p-6, p-10, dll)
   
   - rounded-2xl: Sudut melengkung
     * Ubah ke rounded-lg, rounded-3xl untuk sudut berbeda

3. Responsive:
   - Untuk tablet/mobile, tambahkan:
     * sm:grid-cols-2 (2 kolom di layar kecil)
     * md:grid-cols-3 (3 kolom di layar medium)
     * lg:min-h-[220px] (tinggi berbeda di layar besar)

4. Icon Size:
   - size={48}: Ukuran icon 48px
     * Ubah angka untuk icon lebih besar/kecil

5. Container Width:
   - max-w-6xl: Lebar maksimal container
     * Ubah ke max-w-5xl (lebih kecil) atau max-w-7xl (lebih besar)
*/