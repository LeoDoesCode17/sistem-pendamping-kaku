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
    startTime: new Date(Date.now() - 320000) // 5 menit 20 detik lalu
  },
  {
    id: '2',
    orderCode: 'PP',
    itemName: 'Pisang Goreng',
    startTime: new Date(Date.now() - 140000) // 2 menit 20 detik lalu
  },
  {
    id: '3',
    orderCode: 'BG',
    itemName: 'Bakwan Goreng',
    startTime: new Date(Date.now() - 60000) // 1 menit lalu
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 to-pink-300 rounded-t-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              WAITING LIST
            </h1>
          </div>

          {/* Order List */}
          <div className="bg-white rounded-b-2xl shadow-lg p-6 space-y-4">
            {sortedOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Tidak ada pesanan saat ini</p>
              </div>
            ) : (
              sortedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onComplete={handleComplete}
                />
              ))
            )}
          </div>
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