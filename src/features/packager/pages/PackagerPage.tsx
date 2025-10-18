// features/packager/pages/PackagerPage.tsx
"use client";

import { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { Transaction } from "@/models/transaction";
import { getAllTransactions, updateTransactionStatus } from "@/services/firestore/transaction-collection";
import { useAuth } from "@/context/AuthProvider";
import TransactionCard from "../components/TransactionCard";
import TransactionDetailModal from "../components/TransactionDetailModal";

export default function PackagerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [myShowConfirmation, setMyShowConfirmation] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchTransactions = async () => {
      try {
        const allTransactions = await getAllTransactions(user.outlet.id, false);
        const sortedTransaction = [...allTransactions].sort((a, b) => {
          const now = new Date().getTime();
          const remainingA =
            720000 - (now - new Date(a.timeCreated!).getTime());
          const remainingB =
            720000 - (now - new Date(b.timeCreated!).getTime());
          return remainingA - remainingB;
        });
        setTransactions(sortedTransaction);
        console.log("All transactions: ", sortedTransaction);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, [user]);

  const myHandleCardClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    console.log("transaction is: ", transaction);
    console.log("Selected transaction: ", selectedTransaction);
  };

  const myHandleComplete = () => {
    setMyShowConfirmation(true);
  };

  const myHandleConfirmComplete = async () => {
    console.log("Selected transaction: ", selectedTransaction);
    if (!selectedTransaction || !user) {
      console.warn("Invalid user and transaction");
      return;
    }
    console.log("Selected transaction: ", selectedTransaction);
    try {
      await updateTransactionStatus(user.outlet.id, selectedTransaction.id!, true);
      setTransactions((prev) =>
        prev.filter((t) => t.id !== selectedTransaction.id)
      );
      console.log("Success update transaction status");
    } catch (err) {
      console.error(err);
    }
    setSelectedTransaction(null);
    setMyShowConfirmation(false);
  };

  const myHandleCancelConfirmation = () => {
    setMyShowConfirmation(false);
  };

  const myHandleCloseDetail = () => {
    setSelectedTransaction(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout */}
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-2xl text-gray-500">
                Tidak ada pesanan saat ini
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((transaction) => (
                <TransactionCard
                  onClick={myHandleCardClick}
                  transaction={transaction}
                  key={transaction.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TransactionDetailModal
        isOpen={selectedTransaction !== null && !myShowConfirmation}
        transaction={selectedTransaction}
        onClose={myHandleCloseDetail}
        onComplete={myHandleComplete}
      />

      <ConfirmationModal
        isOpen={myShowConfirmation}
        orderCode={selectedTransaction?.code || ""}
        onConfirm={myHandleConfirmComplete}
        onCancel={myHandleCancelConfirmation}
      />
    </>
  );
}
