// features/chef/pages/ChefPage.tsx
"use client";

import { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { OrderedMenu } from "@/models/ordered-menu";
import { useAuth } from "@/context/AuthProvider";
import { updateOrderedMenuStatus } from "@/services/firestore/transaction-collection";
import OrderedMenuListItem from "../components/OrderedMenuListItem";
import QueueInfoModal from "../components/QueueInfoModal";
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
import { Clock } from 'lucide-react';

export default function ChefPage() {
  const [orderedMenus, setOrderedMenus] = useState<OrderedMenu[]>([]);
  const [selectedOrderedMenu, setSelectedOrderedMenu] = useState<OrderedMenu | null>(null);
  const [showQueueModal, setShowQueueModal] = useState(false);

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

  const displayedMenus = orderedMenus.slice(0, 10);
  const queuedMenus = orderedMenus.slice(10);
  const leftColumn = displayedMenus.slice(0, 5);
  const rightColumn = displayedMenus.slice(5, 10);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {orderedMenus.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-2xl text-gray-500">
                Tidak ada pesanan saat ini
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {leftColumn.map((orderedMenu, idx) => (
                    <OrderedMenuListItem
                      key={orderedMenu.id!}
                      orderedMenu={orderedMenu}
                      index={idx + 1}
                      onComplete={myHandleComplete}
                    />
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {rightColumn.map((orderedMenu, idx) => (
                    <OrderedMenuListItem
                      key={orderedMenu.id!}
                      orderedMenu={orderedMenu}
                      index={idx + 6}
                      onComplete={myHandleComplete}
                    />
                  ))}
                </div>
              </div>

              {/* Queue Button */}
              {queuedMenus.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowQueueModal(true)}
                    className=" bg-cream text-maroon font-bold px-4 py-2 rounded-lg flex items-center gap-3 transition-colors text-base shadow-lg"
                  >
                    <Clock className="w-5 h-5" />
                    {queuedMenus.length} Antrian Lagi
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={selectedOrderedMenu !== null}
        orderCode={selectedOrderedMenu?.menu.name || ""}
        onConfirm={myHandleConfirm}
        onCancel={myHandleCancel}
      />

      {/* Queue Info Modal */}
      <QueueInfoModal
        isOpen={showQueueModal}
        queuedMenus={queuedMenus}
        onClose={() => setShowQueueModal(false)}
      />
    </>
  );
}