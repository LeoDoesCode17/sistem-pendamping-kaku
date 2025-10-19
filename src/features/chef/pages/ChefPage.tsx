// features/chef/pages/ChefPage.tsx
"use client";

import { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { OrderedMenu } from "@/models/ordered-menu";
import { useAuth } from "@/context/AuthProvider";
import { updateOrderedMenuStatus } from "@/services/firestore/transaction-collection";
import OrderedMenuCard from "../components/OrderedMenuCard";
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
import { getAllMenus } from "@/services/firestore/menu-collection";
import { Menu } from "@/models/menu";
import { Transaction } from "@/models/transaction";

export default function ChefPage() {
  const [orderedMenus, setOrderedMenus] = useState<OrderedMenu[]>([]);

  const [selectedOrderedMenu, setSelectedOrderedMenu] =
    useState<OrderedMenu | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setOrderedMenus([]);
      return;
    }

    let unsub: (() => void) | null = null;
    let mounted = true;

    const fetchOrderedMenus = async () => {
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
                  transactionId: docSnap.id,
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
          const orderedMenus = transactionsData
            .flatMap((t) => t.orderedMenus)
            .filter((o) => o.isDone == false)
            .sort((a, b) => a.timeCreated! - b.timeCreated!);
          setOrderedMenus(orderedMenus);
          console.log("Realtime ordered menu:", orderedMenus);
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrderedMenus();
    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, [user]);

  const myHandleComplete = (orderedMenuId: string) => {
    const orderedMenu = orderedMenus.find((o) => o.id === orderedMenuId);
    if (!orderedMenu) {
      console.error("Ordered menu with id: ", orderedMenuId, " not found");
      return;
    }
    setSelectedOrderedMenu(orderedMenu);
  };

  const myHandleConfirm = async () => {
    if (!selectedOrderedMenu || !user) {
      console.error("Invalid user and ordered menu");
      return;
    }
    try {
      // mark the selectedOrderedMenu as done
      await updateOrderedMenuStatus(
        user.outlet.id,
        selectedOrderedMenu.transactionId!,
        selectedOrderedMenu.id!,
        true
      );
      setOrderedMenus((prev) =>
        prev.filter((o) => o.id !== selectedOrderedMenu.id)
      );
      setSelectedOrderedMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const myHandleCancel = () => {
    setSelectedOrderedMenu(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout */}
          {orderedMenus.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-2xl text-gray-500">
                Tidak ada pesanan saat ini
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orderedMenus.map((orderedMenu) => (
                <OrderedMenuCard
                  key={orderedMenu.id!}
                  orderedMenu={orderedMenu}
                  onComplete={myHandleComplete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {/* <ConfirmationModal
        isOpen={selectedOrder !== null}
        orderCode={selectedOrder?.orderCode || ''}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      /> */}
      <ConfirmationModal
        isOpen={selectedOrderedMenu !== null}
        orderCode={selectedOrderedMenu?.menu.abbreviation || ""}
        onConfirm={myHandleConfirm}
        onCancel={myHandleCancel}
      />
    </>
  );
}
