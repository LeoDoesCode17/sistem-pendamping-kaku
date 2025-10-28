import { OrderType } from '@/features/orders/types/order';

export interface OrderHistory {
  id: string;
  invoiceId: string;          // Invoice ID
  outlet: string;             // Outlet name

  /**
   * orderHeader berfungsi fleksibel:
   * - Dine In / Take Away / WA Order → Nama pemesan
   * - Grab Food / Shopee Food → Kode pesanan (contoh: GF-118)
   * - Go Food → Kode pesanan (contoh: GO1234)
   */
  orderHeader: string;

  orderType: OrderType;
  dateCreated: Date;
  dateFinished: Date;
  totalItems: number;
  items: OrderHistoryItem[];

  // --- Field tambahan untuk dukung layout baru ---
  /**
   * Nomor pesanan tambahan untuk Go Food (misal "445")
   */
  orderCode?: string;

  /**
   * Nomor telepon untuk WA Order
   */
  phone?: string;

  // --- Field opsional untuk tracking waktu kerja ---
  chefStartTime?: Date;
  chefFinishTime?: Date;
  packagerStartTime?: Date;
  packagerFinishTime?: Date;
}

export interface OrderHistoryItem {
  id: string;
  name: string;
  code: string;
  quantity: number;
}

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  orderType?: OrderType | 'all';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}
