"use client";

import TopbarMain from "@/features/ui/Topbar/TopbarMain";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isOrderTypePage = pathname === "/cashier/type-order";
  const isInvoiceListPage = pathname === "/cashier/riwayat-pesanan";
  const isInvoiceDetailPage = pathname.startsWith("/cashier/riwayat-pesanan/");
  const isOrderPage = pathname.includes("/order/");

  return (
    <div className="h-screen overflow-hidden">
      {!isOrderPage && (
        <TopbarMain
          pageType="Kasir"
          // tampilkan tombol back baik di list maupun detail invoice
          showBackButton={isOrderTypePage || isInvoiceListPage || isInvoiceDetailPage}
          backPath={
            isOrderTypePage
              ? "/cashier"
              : isInvoiceListPage || isInvoiceDetailPage
              ? "/cashier/riwayat-pesanan"
              : undefined
          }
        />
      )}
      <main
        className={
          isOrderPage
            ? ""
            : "h-[calc(100vh-80px)] overflow-y-auto overscroll-contain"
        }
      >
        {children}
      </main>
    </div>
  );
}
