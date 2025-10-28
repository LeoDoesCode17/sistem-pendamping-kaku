'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrderHistory, FilterOptions } from '../types/order-history';
import OrderHistoryCard from '../components/OrderHistoryCard';
import OrderFilterBar from '../components/OrderFilterBar';
import Pagination from '../components/Pagination';
import PerformanceStats from '../components/PerformanceStats';
import { filterOrders, paginateOrders } from '../utils/filter';

// --- Dummy data untuk testing (sudah disesuaikan field baru) ---
const DUMMY_ORDERS: OrderHistory[] = [
  // GrabFood -> tampil kode pesanan
  {
    id: '1',
    invoiceId: 'INV-01JY5XPQZ',
    outlet: 'Kaku Palopo',
    orderHeader: 'GF-118', // Kode
    orderType: 'grab-food',
    dateCreated: new Date('2025-06-20'),
    dateFinished: new Date('2025-06-20'),
    totalItems: 3,
    items: [
      { id: '1', name: 'Pentol Pedas', code: 'PP', quantity: 2 },
      { id: '2', name: 'Bakso Goreng', code: 'BG', quantity: 1 },
    ],
  },
  // Dine In -> tampil nama pemesan
  {
    id: '2',
    invoiceId: 'INV-01JY5X9H',
    outlet: 'Kaku Palopo',
    orderHeader: 'Budi Santoso', // Nama
    orderType: 'dine-in',
    dateCreated: new Date('2025-06-20'),
    dateFinished: new Date('2025-06-20'),
    totalItems: 1,
    items: [{ id: '1', name: 'Thai Tea', code: 'TT', quantity: 1 }],
  },
  // Take Away -> tampil nama pemesan
  {
    id: '3',
    invoiceId: 'INV-01JY5X7G',
    outlet: 'Kaku Palopo',
    orderHeader: 'Ani Lestari', // Nama
    orderType: 'take-away',
    dateCreated: new Date('2025-07-20'),
    dateFinished: new Date('2025-07-20'),
    totalItems: 5,
    items: [
      { id: '1', name: 'Pentol Pedas', code: 'PP', quantity: 3 },
      { id: '2', name: 'Tahu Bakso', code: 'TB', quantity: 2 },
    ],
  },
  // WA Order -> tampil nama + nomor telepon
  {
    id: '4',
    invoiceId: 'INV-01JY5X7H',
    outlet: 'Kaku Palopo',
    orderHeader: 'Dina Aprilia', // Nama
    phone: '0812-9999-1234', // WA
    orderType: 'wa-order',
    dateCreated: new Date('2025-07-20'),
    dateFinished: new Date('2025-07-20'),
    totalItems: 4,
    items: [
      { id: '1', name: 'Siomay', code: 'SM', quantity: 2 },
      { id: '2', name: 'Pentol Pedas', code: 'PP', quantity: 2 },
    ],
  },
  // GoFood -> tampil "kode - angka"
  {
    id: '5',
    invoiceId: 'INV-0000000004',
    outlet: 'Kaku Palopo',
    orderHeader: 'GO1234', // kode
    orderCode: '445', // angka
    orderType: 'go-food',
    dateCreated: new Date('2025-06-20'),
    dateFinished: new Date('2025-06-20'),
    totalItems: 5,
    items: [],
  },
  // Shopee Food -> tampil kode saja
  {
    id: '6',
    invoiceId: 'INV-0000000005',
    outlet: 'Kaku Palopo',
    orderHeader: 'SF-77A2', // kode
    orderType: 'shopee-food',
    dateCreated: new Date('2025-06-20'),
    dateFinished: new Date('2025-06-20'),
    totalItems: 1,
    items: [],
  },
  // Tambahan untuk pagination
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `${i + 7}`,
    invoiceId: `INV-${String(i + 7).padStart(10, '0')}`,
    outlet: 'Kaku Palopo',
    orderHeader:
      i % 6 === 0 ? 'GO5678'
      : i % 6 === 1 ? 'GF-220'
      : i % 6 === 2 ? 'SF-11BC'
      : i % 6 === 3 ? 'Dian Sasmita'
      : i % 6 === 4 ? 'Rangga'
      : 'Nina',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderType: (['go-food', 'grab-food', 'shopee-food', 'dine-in', 'take-away', 'wa-order'][i % 6] as any),
    orderCode: i % 6 === 0 ? '910' : undefined,
    phone: i % 6 === 5 ? '0851-7777-8888' : undefined,
    dateCreated: new Date('2025-06-20'),
    dateFinished: new Date('2025-06-20'),
    totalItems: (i % 5) + 1,
    items: [],
  })),
];

const ITEMS_PER_PAGE = 12;

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderHistory[]>(DUMMY_ORDERS);
  const [filteredOrders, setFilteredOrders] = useState<OrderHistory[]>(DUMMY_ORDERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    const filtered = filterOrders(orders, filters);
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [filters, orders]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = paginateOrders(filteredOrders, currentPage, ITEMS_PER_PAGE);

  const handleCardClick = (id: string) => {
    router.push(`/cashier/riwayat-pesanan/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto pb-8">
        <h1 className="text-3xl font-bold text-maroon mb-6">Riwayat Pesanan</h1>

        {/* Sementara disembunyikan */}
        <PerformanceStats />

        <OrderFilterBar onFilterChange={setFilters} />

        <div className="mb-4">
          <p className="text-gray-600">
            Menampilkan {paginatedOrders.length} dari {filteredOrders.length} pesanan
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <p className="text-xl text-gray-500">Tidak ada pesanan ditemukan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedOrders.map((order) => (
                <OrderHistoryCard key={order.id} order={order} onClick={handleCardClick} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
