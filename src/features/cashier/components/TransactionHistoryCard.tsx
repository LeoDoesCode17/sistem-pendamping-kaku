'use client';

import { Transaction } from '@/models/transaction';
import { Outlet } from '@/models/outlet';
import { TransactionCategory } from '@/types/transaction-category';

interface OrderHistoryCardProps {
  transaction: Transaction;
  outlet: Outlet;
  onClick: (id: string) => void;
}

export default function TransactionHistoryCard({ transaction, outlet, onClick }: OrderHistoryCardProps) {
  const formatDate = (date: number) =>
    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })
      .format(new Date(date));

  return (
    <button
      onClick={() => onClick(transaction.id!)}
      className="
        bg-white rounded-lg border-2 border-gray-200 p-5
        hover:border-maroon hover:shadow-lg transition-all text-left w-full
        min-h-56 md:min-h-60  /* samakan tinggi kartu */
      "
    >
      {/* Header with Invoice ID */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-maroon">{transaction.id}</h3>
        <span className="text-sm text-gray-600">{formatDate(transaction.timeCreated!)}</span>
      </div>

      {/* Order Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Outlet:</span>
          <span className="font-semibold text-gray-800">{outlet.name}</span>
        </div>

        {/* Pemesan/kode: 2 baris khusus WA & GoFood */}
        {transaction.category == TransactionCategory.WhatsappOrder && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pemesan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {transaction.code}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">No. WA:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {transaction.code ?? '-'}
              </span>
            </div>
          </>
        )}

        {transaction.category == TransactionCategory.GoFood && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kode Pesanan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {transaction.code}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Angka:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {transaction.code ?? '-'}
              </span>
            </div>
          </>
        )}

        {(transaction.category == TransactionCategory.GrabFood || transaction.category == TransactionCategory.ShopeeFood) && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kode Pesanan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {transaction.code}
              </span>
            </div>
            {/* spacer agar tinggi konsisten */}
            <div className="h-5" />
          </>
        )}

        {(transaction.category == TransactionCategory.DineIn || transaction.category == TransactionCategory.TakeAway) && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pemesan:</span>
              <span className="font-semibold text-gray-800 truncate max-w-[60%] text-right">
                {transaction.code}
              </span>
            </div>
            {/* spacer agar tinggi konsisten */}
            <div className="h-5" />
          </>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tipe Order:</span>
          <span className="font-semibold text-gray-800">{transaction.category}</span>
        </div>
      </div>

      {/* Total Items */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Jumlah Item:</span>
          <span className="text-lg font-bold text-maroon">{transaction.orderedMenus.length}</span>
        </div>
      </div>
    </button>
  );
}
