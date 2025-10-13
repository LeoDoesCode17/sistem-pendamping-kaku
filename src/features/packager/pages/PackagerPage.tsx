// features/packager/pages/PackagerPage.tsx
'use client';

import { useState } from 'react';
import { PackagerOrder } from '../types/packager';
import PackagerOrderCard from '../components/PackagerOrderCard';
import ConfirmationModal from '../components/ConfirmationModal';

// Dummy data untuk testing
const DUMMY_ORDERS: PackagerOrder[] = [
  {
    id: '1',
    orderCode: 'GF-118',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' },
    ],
    createdAt: new Date(Date.now() - 690000) // 11 menit 30 detik lalu
  },
  {
    id: '2',
    orderCode: 'GO-AKBAR',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' }
    ],
    createdAt: new Date(Date.now() - 690000) // 11 menit 30 detik lalu
  },
  {
    id: '3',
    orderCode: 'ACO',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' }
    ],
    createdAt: new Date(Date.now() - 690000) // 11 menit 30 detik lalu
  },
  {
    id: '4',
    orderCode: 'GF-119',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' },
    ],
    createdAt: new Date(Date.now() - 360000) // 11 menit 30 detik lalu
  },
  {
    id: '5',
    orderCode: 'ACI',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' }
    ],
    createdAt: new Date(Date.now() - 30000) // 30 detik lalu
  },
  {
    id: '6',
    orderCode: 'GO-LIZ',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' }
    ],
    createdAt: new Date(Date.now() - 30000) // 30 detik lalu
  }
];

export default function PackagerPage() {
  const [orders, setOrders] = useState<PackagerOrder[]>(DUMMY_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<PackagerOrder | null>(null);

  // Sort orders berdasarkan countdown terkecil (paling urgent)
  const sortedOrders = [...orders].sort((a, b) => {
    const now = new Date().getTime();
    const remainingA = 720000 - (now - new Date(a.createdAt).getTime());
    const remainingB = 720000 - (now - new Date(b.createdAt).getTime());
    return remainingA - remainingB;
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
                <PackagerOrderCard
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