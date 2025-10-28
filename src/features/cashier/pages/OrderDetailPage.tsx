'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { OrderHistory } from '../types/order-history';
import OrderDetailTable from '../components/OrderDetailTable';
import PerformanceStats from '../components/PerformanceStats';

interface OrderDetailPageProps {
  orderId: string;
}

// Dummy (ganti dengan fetch by ID nantinya)
const DUMMY_ORDER: OrderHistory = {
  id: '3',
  invoiceId: 'INV-01JY5X7G',
  outlet: 'Kaku Palopo',
  orderHeader: 'Dina Aprilia',
  phone: '0812-9999-1234',
  orderType: 'wa-order',
  dateCreated: new Date('2025-07-20'),
  dateFinished: new Date('2025-07-20'),
  totalItems: 4,
  items: [
    { id: '1', name: 'Pentol Pedas', code: 'PP', quantity: 2 },
    { id: '2', name: 'Bakso Goreng', code: 'BG', quantity: 1 },
    { id: '3', name: 'Tahu Bakso', code: 'TB', quantity: 1 },
  ],
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  'dine-in': 'Dine In',
  'take-away': 'Take Away',
  'grab-food': 'Grab Food',
  'go-food': 'Go Food',
  'shopee-food': 'Shopee Food',
  'wa-order': 'WA Order',
};

export default function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch by ID
    setTimeout(() => {
      setOrder(DUMMY_ORDER);
      setLoading(false);
    }, 400);
  }, [orderId]);

  const handleBack = () => router.push('/cashier/riwayat-pesanan');

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(date));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-xl text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-maroon hover:text-maroon2 font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <p className="text-xl text-gray-500">Pesanan tidak ditemukan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-maroon hover:text-maroon2 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold text-maroon mb-6">Detail Pesanan</h1>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Invoice ID</p>
              <p className="text-lg font-bold text-maroon">{order.invoiceId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tanggal Transaksi</p>
              <p className="text-lg font-semibold text-gray-800">{formatDate(order.dateCreated)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Outlet</p>
              <p className="text-lg font-semibold text-gray-800">{order.outlet}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipe Order</p>
              <p className="text-lg font-semibold text-gray-800">
                {ORDER_TYPE_LABELS[order.orderType]}
              </p>
            </div>

            {/* 2 baris: WA & GoFood */}
            {order.orderType === 'wa-order' && (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pemesan</p>
                  <p className="text-lg font-semibold text-gray-800">{order.orderHeader}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">No. WA</p>
                  <p className="text-lg font-semibold text-gray-800">{order.phone ?? '-'}</p>
                </div>
              </>
            )}

            {order.orderType === 'go-food' && (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kode Pesanan</p>
                  <p className="text-lg font-semibold text-gray-800">{order.orderHeader}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Angka</p>
                  <p className="text-lg font-semibold text-gray-800">{order.orderCode ?? '-'}</p>
                </div>
              </>
            )}

            {(order.orderType === 'dine-in' || order.orderType === 'take-away') && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-600 mb-1">Pemesan</p>
                <p className="text-lg font-semibold text-gray-800">{order.orderHeader}</p>
              </div>
            )}

            {(order.orderType === 'grab-food' || order.orderType === 'shopee-food') && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-600 mb-1">Kode Pesanan</p>
                <p className="text-lg font-semibold text-gray-800">{order.orderHeader}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-1">Total Item</p>
              <p className="text-lg font-bold text-maroon">{order.totalItems}</p>
            </div>
          </div>
        </div>

        {/* Opsional */}
        <PerformanceStats />

        {/* Items Table */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Item Pesanan</h2>
          <OrderDetailTable items={order.items} />
        </div>
      </div>
    </div>
  );
}
