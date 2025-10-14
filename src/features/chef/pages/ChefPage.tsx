// features/chef/pages/ChefPage.tsx
'use client';

import { useState } from 'react';
import { ChefOrder } from '../types/chef';
import OrderCard from '../components/OrderCard';
import ConfirmationModal from '../components/ConfirmationModal';

// Dummy data untuk testing
const DUMMY_ORDERS: ChefOrder[] = [
  {
    id: '1',
    orderCode: 'PP',
    itemName: 'Pisang Goreng',
    startTime: new Date(Date.now() - 750000) // 12 menit 30 detik lalu
  },
  {
    id: '2',
    orderCode: 'PP',
    itemName: 'Pisang Goreng',
    startTime: new Date(Date.now() - 570000) // 9 menit 30 detik lalu
  },
  {
    id: '3',
    orderCode: 'BG',
    itemName: 'Bakwan Goreng',
    startTime: new Date(Date.now() - 490000) // 8 menit 10 detik lalu
  },
  {
    id: '4',
    orderCode: 'TB',
    itemName: 'Tahu Bakso',
    startTime: new Date(Date.now() - 255000) // 4 menit 15 detik lalu
  },
  {
    id: '5',
    orderCode: 'CG',
    itemName: 'Cireng',
    startTime: new Date(Date.now() - 125000) // 2 menit 5 detik lalu
  },
  {
    id: '6',
    orderCode: 'TT',
    itemName: 'Thai Tea',
    startTime: new Date(Date.now() - 45000) // 45 detik lalu
  }
];

export default function ChefPage() {
  const [orders, setOrders] = useState<ChefOrder[]>(DUMMY_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<ChefOrder | null>(null);

  // Sort orders berdasarkan waktu terlama (urgent) di atas
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  const handleComplete = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleConfirm = () => {
    if (selectedOrder) {
      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      setSelectedOrder(null);
    }
  };

  const handleCancel = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
 

          {/* Grid Layout */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-2xl text-gray-500">Tidak ada pesanan saat ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={selectedOrder !== null}
        orderCode={selectedOrder?.orderCode || ''}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}