// features/orders/pages/OrderPage.tsx
"use client";

import { useEffect, useState } from "react";
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

interface OrderPageProps {
  orderType: OrderType;
  transactionCategory?: TransactionCategory;
}

export default function OrderPage({
  orderType,
  transactionCategory,
}: OrderPageProps) {
  const [orderData, setOrderData] = useState<OrderHeaderData>({});
  const [myCategory, setMyCategory] = useState<string>("all");
  const [myCartItems, setMyCartItems] = useState<OrderedMenu[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const allMenus = await getAllMenus();
        setMenus(allMenus);
        console.log(allMenus);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenus();
  }, []);

  const myMenuFilter =
    myCategory === "all"
      ? menus
      : menus.filter((menu) => menu.category === myCategory);

  // Handle klik menu item
  const myHandleMenuItemClick = (item: Menu) => {
    setMyCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.menu.abbreviation === item.abbreviation
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.menu.abbreviation === item.abbreviation
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

  // Handle update quantity
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

  // Handle remove item
  const myHandleRemoveItem = (itemId: string | null) => {
    setMyCartItems((prev) => prev.filter((item) => itemId !== item.id));
  };

  // Handle konfirmasi pesanan
  const myHandleConfirmOrder = async () => {
    if (!user) {
      console.log("User is not valid");
      return;
    }
    const code = getOrderDataValue(orderData);
    const category = transactionCategory;
    if (!category) {
      console.log("Invalid category");
      return;
    }
    const outlet = user.outlet;
    const transaction = new Transaction({
      code: code,
      category: category,
      orderedMenus: myCartItems,
      isDone: false,
      id: null,
      timeCreated: null,
      timeFinished: null,
    });
    console.log("Transaction data: ", transaction);
    console.log("Outlet: ", outlet);
    try {
      await createNewTransaction(outlet.id, transaction);
      alert("Pesanan dibuat");
    } catch (err) {
      alert("Pesanan gagal dibuat");
      console.error("Error when create a new transaction: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Menu Section */}
          <div className="col-span-8">
            {/* Order Header */}
            <OrderHeader orderType={orderType} onDataChange={setOrderData} />

            {/* Category Filter */}
            <CategoryFilter myOnCategoryChange={setMyCategory} />

            {/* Menu Grid */}
            <MenuGrid
              items={myMenuFilter}
              onItemClick={myHandleMenuItemClick}
            />
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
    </div>
  );
}
