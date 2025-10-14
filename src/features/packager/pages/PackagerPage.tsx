// features/packager/pages/PackagerPage.tsx
'use client';

import { useState } from 'react';
import { PackagerOrder } from '../types/packager';
import PackagerOrderCard from '../components/PackagerOrderCard';
import OrderDetailModal from '../components/OrderDetailModal';
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
      { quantity: 1, itemName: 'Tahu Bakso', itemCode: 'TB' },
      { quantity: 2, itemName: 'Cireng', itemCode: 'CG' },
      { quantity: 1, itemName: 'Thai Tea', itemCode: 'TT' }
    ],
    createdAt: new Date(Date.now() - 690000) // 11 menit 30 detik lalu
  },
  {
    id: '2',
    orderCode: 'GO-AKBAR',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' },
      { quantity: 1, itemName: 'Bakso Goreng', itemCode: 'BG' }
    ],
    createdAt: new Date(Date.now() - 690000)
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
    createdAt: new Date(Date.now() - 690000)
  },
  {
    id: '4',
    orderCode: 'GF-119',
    orderTime: '12:48',
    orderType: 'Take away',
    items: [
      { quantity: 2, itemName: 'Pentol Pedas', itemCode: 'PP' }
    ],
    createdAt: new Date(Date.now() - 690000)
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
    createdAt: new Date(Date.now() - 30000)
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
    createdAt: new Date(Date.now() - 30000)
  }
];

export default function PackagerPage() {
  const [orders, setOrders] = useState<PackagerOrder[]>(DUMMY_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<PackagerOrder | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sort orders berdasarkan countdown terkecil (paling urgent)
  const sortedOrders = [...orders].sort((a, b) => {
    const now = new Date().getTime();
    const remainingA = 720000 - (now - new Date(a.createdAt).getTime());
    const remainingB = 720000 - (now - new Date(b.createdAt).getTime());
    return remainingA - remainingB;
  });

  const handleCardClick = (order: PackagerOrder) => {
    setSelectedOrder(order);
  };

  const handleComplete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmComplete = () => {
    if (selectedOrder) {
      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      setSelectedOrder(null);
      setShowConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleCloseDetail = () => {
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
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={selectedOrder !== null && !showConfirmation}
        order={selectedOrder}
        onComplete={handleComplete}
        onClose={handleCloseDetail}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        orderCode={selectedOrder?.orderCode || ''}
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelConfirmation}
      />
    </>
  );
}