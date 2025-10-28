export type OrderType =
  | 'dine-in'
  | 'take-away'
  | 'grab-food'
  | 'go-food'
  | 'shopee-food'
  | 'wa-order';

export interface OrderHeaderData {
  customerName?: string;
  orderCode?: string;
  phoneNumber?: string;
  gofoodCode?: string;
}

/**
 * Menghasilkan string yang akan disimpan ke Transaction.code
 * - GoFood: jika ada gofoodCode, gabungkan "orderCode - gofoodCode"
 * - Lainnya: prioritas customerName -> orderCode -> phoneNumber
 */
export const getOrderDataValue = (orderData: OrderHeaderData): string => {
  // ✅ khusus GoFood (opsional angka)
  if (orderData.orderCode && orderData.gofoodCode) {
    return `${orderData.orderCode} - ${orderData.gofoodCode}`;
  }
  if (orderData.customerName) return orderData.customerName;
  if (orderData.orderCode) return orderData.orderCode;
  if (orderData.phoneNumber) return orderData.phoneNumber;
  return '';
};
