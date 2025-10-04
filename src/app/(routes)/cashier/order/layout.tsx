// app/order/layout.tsx  (atau app/cashier/order/layout.tsx jika route-mu di bawah /cashier)
'use client';

import TopbarOrder from "@/features/ui/Topbar/TopbarOrder";
import { usePathname } from "next/navigation";

const orderTypeMap: Record<string, string> = {
  "grab-food": "Grab Food",
  "go-food": "Go Food",
  "shopee-food": "Shopee Food",
  "wa-order": "Wa Order",
  "dine-in": "Dine In",
  "take-away": "Take Away",
  // toleransi untuk variasi key
  "takeaway": "Take Away",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const segments = pathname.split('/').filter(Boolean);

  // cari segmen setelah 'order'
  const orderIndex = segments.findIndex((s) => s === 'order');
  let orderKey = '';
  if (orderIndex >= 0 && segments[orderIndex + 1]) {
    orderKey = segments[orderIndex + 1];
  } else {
    // kalau tidak ada 'order' di path, ambil segmen terakhir (mis. /order/grab-food atau /cashier/grab-food)
    orderKey = segments[segments.length - 1] ?? '';
  }

  const orderType =
    orderTypeMap[orderKey] ??
    (orderKey ? orderKey.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Order');

  return (
    <div className="h-screen overflow-hidden">
      <TopbarOrder orderType={orderType} />
      <main className="h-[calc(100vh-80px)] overflow-auto">
        {children}
      </main>
    </div>
  );
}
