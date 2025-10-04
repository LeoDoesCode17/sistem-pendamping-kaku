// app/cashier/layout.tsx
"use client";

import TopbarMain from "@/features/ui/Topbar/TopbarMain";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOrderTypePage = pathname === "/cashier/type-order";
  const isOrderPage = pathname.includes("/order/");

  return (
    <div className="h-screen overflow-hidden">
      {!isOrderPage && (
        <TopbarMain 
          pageType="Kasir" 
          showBackButton={isOrderTypePage}
          backPath={isOrderTypePage ? "/cashier" : undefined} // Specify back path
        />
      )}
      <main className={isOrderPage ? "" : "h-[calc(100vh-80px)]"}>
        {children}
      </main>
    </div>
  );
}