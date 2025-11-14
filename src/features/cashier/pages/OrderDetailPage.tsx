'use client';

import { useState, useEffect } from 'react';
import { getTransactionById } from '@/services/firestore/transaction-collection';
import { useAuth } from '@/context/AuthProvider';
import { Transaction } from '@/models/transaction';
import { TransactionCategory } from '@/types/transaction-category';
import TransactionDetailTable from '../components/TransactionDetailTable';

interface OrderDetailPageProps {
  orderId: string;
}

export default function TransactionDetailPage({ orderId }: OrderDetailPageProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTransaction(null);
      return;
    }
    // TODO: fetch by ID
    const fetchTransactionById = async () => {
      try {
        const fethcedTransaction = await getTransactionById(user.outlet.id, orderId); 
        if(!fethcedTransaction) {
          console.error('Transaction not found');
          return;
        }
        setTransaction(fethcedTransaction);
      }catch(err) {
        console.error(err);
      }
    }
    fetchTransactionById().finally(() => setLoading(false));
  }, [orderId, user]);

  console.log('Fetched transaction:', transaction);
  const formatDate = (date: number) =>
    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(date));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-xl text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
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


        {/* Header */}
        <h1 className="text-3xl font-bold text-maroon mb-6">Detail Pesanan</h1>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Invoice ID</p>
              <p className="text-lg font-bold text-maroon">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tanggal Transaksi</p>
              <p className="text-lg font-semibold text-gray-800">{formatDate(transaction.timeCreated!)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Outlet</p>
              <p className="text-lg font-semibold text-gray-800">{user?.outlet.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipe Order</p>
              <p className="text-lg font-semibold text-gray-800">
                {transaction.category}
              </p>
            </div>

            {/* 2 baris: WA & GoFood */}
            {transaction.category == TransactionCategory.WhatsappOrder && (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pemesan</p>
                  <p className="text-lg font-semibold text-gray-800">{transaction.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">No. WA</p>
                  <p className="text-lg font-semibold text-gray-800">{transaction.code ?? '-'}</p>
                </div>
              </>
            )}

            {transaction.category == TransactionCategory.GoFood && (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kode Pesanan</p>
                  <p className="text-lg font-semibold text-gray-800">{transaction.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Angka</p>
                  <p className="text-lg font-semibold text-gray-800">{transaction.code ?? '-'}</p>
                </div>
              </>
            )}

            {(transaction.category == TransactionCategory.DineIn || transaction.category == TransactionCategory.TakeAway) && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-600 mb-1">Pemesan</p>
                <p className="text-lg font-semibold text-gray-800">{transaction.code}</p>
              </div>
            )}

            {(transaction.category == TransactionCategory.GrabFood || transaction.category == TransactionCategory.ShopeeFood) && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-600 mb-1">Kode Pesanan</p>
                <p className="text-lg font-semibold text-gray-800">{transaction.code}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-1">Total Item</p>
              <p className="text-lg font-bold text-maroon">{transaction.orderedMenus.length}</p>
            </div>
          </div>
        </div>

        {/* Opsional */}
        {/* <PerformanceStats /> */}

        {/* Items Table */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Item Pesanan</h2>
          <TransactionDetailTable items={transaction.orderedMenus} />
        </div>
      </div>
    </div>
  );
}