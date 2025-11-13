"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MyFilterOptions } from "../types/order-history";
import Pagination from "../components/Pagination";
import PerformanceStats from "../components/PerformanceStats";
import { myFilterTransactions, myPaginateTransactions } from "../utils/filter";
import { getAllTransactions } from "@/services/firestore/transaction-collection";
import { useAuth } from "@/context/AuthProvider";
import { Transaction } from "@/models/transaction";
import MyOrderFilterBar from "../components/MyOrderFilterBar";
import TransactionHistoryCard from "../components/TransactionHistoryCard";

const ITEMS_PER_PAGE = 9;

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [constantTransactions, setConstantTransaction] = useState<Transaction[]>([]);
  // const [myFilters, setMyFilters] = useState<MyFilterOptions>({});
  const [doneTransactions, setDoneTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) {
      setDoneTransactions([]);
      return;
    }
    console.log("User is: ", user);
    const fetchDoneTransactions = async () => {
      try {
        const fetchedTransactions = await getAllTransactions(
          user.outlet.id,
          true
        );
        setConstantTransaction(fetchedTransactions);
        setDoneTransactions(fetchedTransactions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoneTransactions();;
    setCurrentPage(1);
  }, [user]); // when include doneTransactions the filter is working but causes infinity loop

  const totalPages = Math.ceil(doneTransactions.length / ITEMS_PER_PAGE);

  const myPaginatedTransactions = myPaginateTransactions(
    doneTransactions,
    currentPage,
    ITEMS_PER_PAGE,
  );

  const handleCardClick = (id: string) => {
    router.push(`/cashier/riwayat-pesanan/${id}`);
  };

  const handleFilterChange = (filters: MyFilterOptions) => {
    const filtered = myFilterTransactions(
      constantTransactions,
      filters,
    );
    setDoneTransactions(filtered);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto pb-8">
        <h1 className="text-3xl font-bold text-maroon mb-6">Riwayat Pesanan</h1>

        {/* Sementara disembunyikan */}
        <PerformanceStats />

        <MyOrderFilterBar onFilterChange={handleFilterChange} />

        <div className="mb-4">
          <p className="text-gray-600">
            Menampilkan {myPaginatedTransactions.length} dari {doneTransactions.length}{" "}
            pesanan
          </p>
          {/* <p className="text-gray-600">
            Menampilkan {paginatedOrders.length} dari {filteredOrders.length}{" "}
            pesanan
          </p> */}
        </div>

        {doneTransactions.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <p className="text-xl text-gray-500">Tidak ada pesanan ditemukan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPaginatedTransactions.map((transaction) => (
                <TransactionHistoryCard key={transaction.id} transaction={transaction} onClick={handleCardClick} outlet={user!.outlet}/>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
