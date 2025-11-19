// features/orders/pages/OrderPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ⬅️ Next 13 App Router

import { OrderType, OrderHeaderData, getOrderDataValue } from "../types/order";
import OrderHeader from "../components/OrderHeader";
import CategoryFilter from "../components/CategoryFilter";
import MenuGrid from "../components/MenuGrid";
import Cart from "../components/Cart";
import { Menu } from "@/models/menu";
import { getAllMenus } from "@/services/firestore/menu-collection";
import { OrderedMenu } from "@/models/ordered-menu";
import { v4 as uuid4 } from "uuid";
import { TransactionCategory } from "@/types/transaction-category";
import { useAuth } from "@/context/AuthProvider";
import { Transaction } from "@/models/transaction";
import { createNewTransaction } from "@/services/firestore/transaction-collection";

import { validateBeforeSubmit } from "../utils/validation";
import AlertNotification from "../components/AlertNotification";

interface OrderPageProps {
  orderType: OrderType;
  transactionCategory?: TransactionCategory;
}

export default function OrderPage({
  orderType,
  transactionCategory,
}: OrderPageProps) {
  const router = useRouter(); // ⬅️ router
  const [orderData, setOrderData] = useState<OrderHeaderData>({});
  const [myCategory, setMyCategory] = useState<string>("all");
  const [myCartItems, setMyCartItems] = useState<OrderedMenu[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const { user } = useAuth();

  // Durasi alert & redirect (biar sinkron)
  const ALERT_DURATION = 3000;

  const [alert, setAlert] = useState<{
    type: "success" | "warning" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const allMenus = await getAllMenus();
        setMenus(allMenus);
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Gagal memuat menu." });
      }
    };
    fetchMenus();
  }, []);

  const myMenuFilter =
    myCategory === "all"
      ? menus
      : menus.filter((menu) => menu.category === myCategory);

  const myHandleMenuItemClick = (item: Menu) => {
    setMyCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.menu.name === item.name
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.menu.name === item.name
            ? OrderedMenu.fromJson({
                ...cartItem,
                quantity: cartItem.quantity + 1,
              })
            : cartItem
        );
      } else {
        return [
          ...prev,
          new OrderedMenu({
            id: uuid4(),
            menu: item,
            quantity: 1,
            isDone: false,
            customize: null,
            timeCreated: null,
            timeFinished: null,
            transactionId: null,
          }),
        ];
      }
    });
  };

  const myHandleUpdateQuantity = (itemId: string | null, newQuantity: number) => {
    if (newQuantity <= 0) {
      myHandleRemoveItem(itemId);
      return;
    }
    setMyCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? OrderedMenu.fromJson({ ...item, quantity: newQuantity })
          : item
      )
    );
  };

  const myHandleRemoveItem = (itemId: string | null) => {
    setMyCartItems((prev) => prev.filter((item) => itemId !== item.id));
  };

  const myHandleConfirmOrder = async () => {
    if (!user) {
      setAlert({ type: "error", message: "Sesi belum valid. Silakan login ulang." });
      return;
    }
    if (!transactionCategory) {
      setAlert({ type: "error", message: "Kategori transaksi tidak valid." });
      return;
    }

    // Validasi field wajib + isi keranjang
    const v = validateBeforeSubmit({
      orderType,
      orderData,
      items: myCartItems,
    });
    if (!("ok" in v) || v.ok === false) {
      setAlert({ type: "warning", message: v.message });
      return;
    }

    const code = getOrderDataValue(orderData);
    const outlet = user.outlet;

    const transaction = new Transaction({
      code: code,
      category: transactionCategory,
      orderedMenus: myCartItems,
      isDone: false,
      id: null,
      timeCreated: null,
      timeFinished: null,
    });

    try {
      await createNewTransaction(outlet.id, transaction);

      // Alert sukses + reset form/cart
      setAlert({ type: "success", message: "Pesanan berhasil dicatat." });
      setMyCartItems([]);
      setOrderData({});

      // Redirect setelah alert tampil
      setTimeout(() => {
        router.push("/cashier/type-order");
      }, ALERT_DURATION);
    } catch (err) {
      console.error("Error when create a new transaction: ", err);
      setAlert({ type: "error", message: "Pesanan gagal dicatat. Coba lagi." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Menu Section */}
          <div className="col-span-8">
            <OrderHeader orderType={orderType} onDataChange={setOrderData} />
            <CategoryFilter myOnCategoryChange={setMyCategory} />
            <MenuGrid items={myMenuFilter} onItemClick={myHandleMenuItemClick} />
          </div>

          {/* Right Side - Cart */}
          <div className="col-span-4">
            <Cart
              items={myCartItems}
              onUpdateQuantity={myHandleUpdateQuantity}
              onRemoveItem={myHandleRemoveItem}
              onConfirmOrder={myHandleConfirmOrder}
            />
          </div>
        </div>
      </div>

      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          autoHideMs={ALERT_DURATION} // ⬅️ durasi alert
        />
      )}
    </div>
  );
}
