export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}