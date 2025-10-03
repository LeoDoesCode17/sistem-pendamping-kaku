"use client";

import TopbarOrder from "@/features/ui/Topbar/TopbarOrder";
import { usePathname } from "next/navigation";

const orderTypeMap: Record<string, string> = {
  "grab-food": "Grab Food",
  "go-food": "Go Food",
  "shopee-food": "Shopee Food",
  "wa-order": "Wa Order",
  "dine-in": "Dine In",
  "takeaway": "Take Away",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  const orderType = orderTypeMap[lastSegment] || "Order";

  return (
    <div className="h-screen overflow-hidden">
      <TopbarOrder orderType={orderType as any} />
      <main className="h-[calc(100vh-80px)] overflow-hidden">{children}</main>
    </div>
  );
}
