'use client';

import { OrderHistory } from '../types/order-history';
import { OrderType } from '@/features/orders/types/order';

interface OrderHistoryCardProps {
  order: OrderHistory;
  onClick: (id: string) => void;
}

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  'dine-in': 'Dine In',
  'take-away': 'Take Away',
  'grab-food': 'Grab Food',
  'go-food': 'Go Food',
  'shopee-food': 'Shopee Food',
  'wa-order': 'WA Order',
};

export default function OrderHistoryCard({ order, onClick }: OrderHistoryCardProps) {
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })
      .format(new Date(date));

  return (
    <button
      onClick={() => onClick(order.id)}
      className="
        bg-white rounded-lg border-2 border-gray-200 p-5
        hover:border-maroon hover:shadow-lg transition-all text-left w-full
        min-h-56 md:min-h-60  /* samakan tinggi kartu */
      "
    >
      {/* Header with Invoice ID */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-maroon">{order.invoiceId}</h3>
        <span className="text-sm text-gray-600">{formatDate(order.dateCreated)}</span>
      </div>

      {/* Order Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Outlet:</span>
          <span className="font-semibold text-gray-800">{order.outlet}</span>
        </div>

        {/* Pemesan/kode: 2 baris khusus WA & GoFood */}
        {order.orderType === 'wa-order' && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pemesan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {order.orderHeader}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">No. WA:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {order.phone ?? '-'}
              </span>
            </div>
          </>
        )}

        {order.orderType === 'go-food' && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kode Pesanan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {order.orderHeader}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Angka:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {order.orderCode ?? '-'}
              </span>
            </div>
          </>
        )}

        {(order.orderType === 'grab-food' || order.orderType === 'shopee-food') && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kode Pesanan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {order.orderHeader}
              </span>
            </div>
            {/* spacer agar tinggi konsisten */}
            <div className="h-5" />
          </>
        )}

        {(order.orderType === 'dine-in' || order.orderType === 'take-away') && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pemesan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {order.orderHeader}
              </span>
            </div>
            {/* spacer agar tinggi konsisten */}
            <div className="h-5" />
          </>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tipe Order:</span>
          <span className="font-semibold text-gray-800">{ORDER_TYPE_LABELS[order.orderType]}</span>
        </div>
      </div>

      {/* Total Items */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Jumlah Item:</span>
          <span className="text-lg font-bold text-maroon">{order.totalItems}</span>
        </div>
      </div>
    </button>
  );
}
