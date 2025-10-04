// features/cashier/pages/OrderTypePage.tsx
'use client';

import { UtensilsCrossed, ShoppingBag, Bike, Package, ShoppingCart, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function OrderTypePage() {
  const router = useRouter();

  const orderTypes: OrderType[] = [
    { id: 'dine-in', name: 'Dine In', icon: <UtensilsCrossed size={32} /> },
    { id: 'take-away', name: 'Take Away', icon: <ShoppingBag size={32} /> },
    { id: 'go-food', name: 'Go Food', icon: <Bike size={32} /> },
    { id: 'grab-food', name: 'Grab Food', icon: <Package size={32} /> },
    { id: 'shopee-food', name: 'Shopee Food', icon: <ShoppingCart size={32} /> },
    { id: 'wa-order', name: 'Wa Order', icon: <MessageSquare size={32} /> },
  ];

  const handleOrderTypeClick = (type: string) => {
    // Default navigate ke /order/{type}. 
    // Jika route real-mu berada di /cashier/order/{type} ganti jadi `/cashier/order/${type}`
    router.push(`/cashier/order/${type}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#8B0000] text-center mb-8">
        Pilih Tipe Pesanan
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {orderTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleOrderTypeClick(type.id)}
            aria-label={`Pilih ${type.name}`}
            className="
              bg-[#8B0000]
              text-white
              rounded-2xl
              p-5                 
              min-h-[140px]       
              flex
              flex-col
              items-center
              justify-center
              gap-3
              hover:bg-[#A52A2A]
              transition-transform
              duration-150
              shadow-md
              hover:shadow-lg
              active:scale-[0.99]
            "
          >
            <div className="bg-white/10 rounded-full p-3">
              {type.icon}
            </div>

            <span className="text-xl font-semibold">
              {type.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
