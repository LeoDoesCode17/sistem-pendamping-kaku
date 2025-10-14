// features/packager/types/packager.ts
export interface PackagerOrderItem {
  quantity: number;
  itemName: string;
  itemCode: string;
}

export interface PackagerOrder {
  id: string;
  orderCode: string;
  orderTime: string; // Format: "HH:mm"
  orderType: string; // "Take away", "Dine in", "Grab food", dll
  items: PackagerOrderItem[];
  createdAt: Date; // Untuk hitung countdown
}