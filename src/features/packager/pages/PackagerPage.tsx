// features/packager/pages/PackagerPage.tsx
"use client";

import { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { Transaction } from "@/models/transaction";
import { updateTransactionStatus } from "@/services/firestore/transaction-collection";
import { useAuth } from "@/context/AuthProvider";
import TransactionCard from "../components/TransactionCard";
import TransactionDetailModal from "../components/TransactionDetailModal";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { OrderedMenu } from "@/models/ordered-menu";
import { Menu } from "@/models/menu";
import { getAllMenus } from "@/services/firestore/menu-collection";

export default function PackagerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [myShowConfirmation, setMyShowConfirmation] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    let unsub: (() => void) | null = null;
    let mounted = true;

    const fetchTransactions = async () => {
      try {
        const colRef = collection(
          firestore,
          `transactions/${user.outlet.id}/list`
        );
        const q = query(colRef, where("isDone", "==", false));

        const allMenus = await getAllMenus();
        const menuMap = new Map(allMenus.map((menu) => [menu.id, menu]));

        // subscribe to changes
        unsub = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
          if (!mounted) return;
          const transactionsData = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const timeCreated =
              data.timeCreated instanceof Timestamp
                ? data.timeCreated.toMillis()
                : typeof data.timeCreated === "number"
                ? data.timeCreated
                : null;
            const timeFinished =
              data.timeFinished instanceof Timestamp
                ? data.timeFinished.toMillis()
                : typeof data.timeFinished === "number"
                ? data.timeFinished
                : null;
            const orderedMenus: OrderedMenu[] = data.orderedMenus.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (orderedMenu: any) =>
                OrderedMenu.fromJson({
                  id: orderedMenu.id as string,
                  menu: menuMap.get(orderedMenu.menu as string) as Menu,
                  quantity: orderedMenu.quantity as number,
                  customize: orderedMenu.customize as string | null,
                  timeCreated: timeCreated,
                  timeFinished: timeFinished,
                  isDone: orderedMenu.isDone as boolean,
                })
            );
            return Transaction.fromJson({
              id: docSnap.id as string,
              code: data.code as string,
              category: data.category as string,
              orderedMenus: orderedMenus,
              timeCreated: timeCreated,
              timeFinished: timeFinished,
              isDone: data.isDone as boolean,
            });
          });
          const sortedTransaction = [...transactionsData].sort((a, b) => {
            const now = new Date().getTime();
            const remainingA =
              720000 - (now - new Date(a.timeCreated!).getTime());
            const remainingB =
              720000 - (now - new Date(b.timeCreated!).getTime());
            return remainingA - remainingB;
          });
          setTransactions(sortedTransaction);
          console.log("Realtime transactions:", sortedTransaction);
        });
        // const allTransactions = await getAllTransactions(user.outlet.id, false);
        // const sortedTransaction = [...allTransactions].sort((a, b) => {
        //   const now = new Date().getTime();
        //   const remainingA =
        //     720000 - (now - new Date(a.timeCreated!).getTime());
        //   const remainingB =
        //     720000 - (now - new Date(b.timeCreated!).getTime());
        //   return remainingA - remainingB;
        // });
        // setTransactions(sortedTransaction);
        // console.log("All transactions: ", sortedTransaction);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
    return () => {
      mounted = false;
      if (unsub) unsub();
    };
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
      await updateTransactionStatus(
        user.outlet.id,
        selectedTransaction.id!,
        true
      );
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
