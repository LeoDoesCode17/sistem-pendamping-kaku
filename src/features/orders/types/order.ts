// features/orders/types/order.ts
export type OrderType = 'dine-in' | 'take-away' | 'grab-food' | 'go-food' | 'shopee-food' | 'wa-order';

export interface OrderHeaderData {
  customerName?: string;
  orderCode?: string;
  phoneNumber?: string;
}

export const getOrderDataValue = (orderData: OrderHeaderData): string => {
  if (orderData.customerName) return orderData.customerName;
  if (orderData.orderCode) return orderData.orderCode;
  if (orderData.phoneNumber) return orderData.phoneNumber;
  return '';
}