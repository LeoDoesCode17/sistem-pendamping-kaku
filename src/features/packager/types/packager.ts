// features/packager/types/packager.ts
export interface PackagerOrderItem {
  quantity: number;
  itemName: string;
  itemCode: string;
} // equal to OrderedMenu

export interface PackagerOrder {
  id: string;
  orderCode: string;
  orderTime: string; // Format: "HH:mm"
  orderType: string; // "Take away", "Dine in", "Grab food", dll
  items: PackagerOrderItem[];
  createdAt: Date; // Untuk hitung countdown
} // equal to Transaction