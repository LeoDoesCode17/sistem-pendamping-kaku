// features/orders/types/order.ts
export type OrderType = 'dine-in' | 'take-away' | 'grab-food' | 'go-food' | 'shopee-food' | 'wa-order';

export interface OrderHeaderData {
  customerName?: string;
  orderCode?: string;
  phoneNumber?: string;
}