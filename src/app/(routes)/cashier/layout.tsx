"use client";

import TopbarMain from "@/features/ui/Topbar/TopbarMain";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isOrderTypePage = pathname === "/cashier/type-order";
  const isInvoiceListPage = pathname === "/cashier/riwayat-pesanan";
  const isInvoiceDetailPage = pathname.startsWith("/cashier/riwayat-pesanan/") && pathname !== "/cashier/riwayat-pesanan";
  const isOrderPage = pathname.includes("/order/");

  // Mapping yang lebih jelas
  const navigationConfig = {
    ["/cashier/type-order"]: "/cashier",
    ["/cashier/riwayat-pesanan"]: "/cashier",
    // untuk detail page, kita handle secara dinamis
  };

  const getBackPath = () => {
    if (isInvoiceDetailPage) return "/cashier/riwayat-pesanan";
    return navigationConfig[pathname as keyof typeof navigationConfig];
  };

  const showBackButton = isOrderTypePage || isInvoiceListPage || isInvoiceDetailPage;

  return (
    <div className="h-screen overflow-hidden">
      {!isOrderPage && (
        <TopbarMain
          pageType="Kasir"
          showBackButton={showBackButton}
          backPath={getBackPath()}
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