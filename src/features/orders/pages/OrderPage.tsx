// features/orders/pages/OrderPage.tsx
'use client';

import { useState } from 'react';
import { OrderType, OrderHeaderData } from '../types/order';
import { MenuItem, CartItem } from '../types/menu';
import { CategoryId } from '../constants/categories';
import OrderHeader from '../components/OrderHeader';
import CategoryFilter from '../components/CategoryFilter';
import MenuGrid from '../components/MenuGrid';
import Cart from '../components/Cart';

interface OrderPageProps {
  orderType: OrderType;
}

// Dummy data menu (nanti bisa diganti dengan fetch dari API)
const DUMMY_MENU: MenuItem[] = [
  { id: '1', name: 'Tahu Bakso', category: 'gorengan', price: 5000 },
  { id: '2', name: 'Pisang Goreng', category: 'pisang', price: 3000 },
  { id: '3', name: 'Thai Tea', category: 'minuman', price: 8000 },
  { id: '4', name: 'Sambal Kacang', category: 'sambal', price: 2000 },
  { id: '5', name: 'Tahu Isi', category: 'gorengan', price: 4000 },
  { id: '6', name: 'Tempe Mendoan', category: 'gorengan', price: 3000 },
  { id: '7', name: 'Cireng', category: 'gorengan', price: 3000 },
  { id: '8', name: 'Cimol Original', category: 'cimol', price: 5000 },
  { id: '9', name: 'Cimol Pedas', category: 'cimol', price: 5000 },
  { id: '10', name: 'Pisang Coklat', category: 'pisang', price: 4000 },
  { id: '11', name: 'Pisang Keju', category: 'pisang', price: 4000 },
  { id: '12', name: 'Tahu Crispy', category: 'gorengan', price: 4000 },
  { id: '13', name: 'Bakwan Jagung', category: 'gorengan', price: 3000 },
  { id: '14', name: 'Es Teh Manis', category: 'minuman', price: 3000 },
  { id: '15', name: 'Es Jeruk', category: 'minuman', price: 5000 },
  { id: '16', name: 'Kopi Susu', category: 'minuman', price: 8000 },
  { id: '17', name: 'Sambal Matah', category: 'sambal', price: 2000 },
  { id: '18', name: 'Tahu Rebus', category: 'rebusan', price: 3000 },
  { id: '19', name: 'Telur Rebus', category: 'rebusan', price: 2000 },
  { id: '20', name: 'Jagung Rebus', category: 'rebusan', price: 4000 },
];

export default function OrderPage({ orderType }: OrderPageProps) {
  const [orderData, setOrderData] = useState<OrderHeaderData>({});
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Filter menu berdasarkan kategori
  const filteredMenu = selectedCategory === 'all' 
    ? DUMMY_MENU 
    : DUMMY_MENU.filter(item => item.category === selectedCategory);

  // Handle klik menu item
  const handleMenuItemClick = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Jika sudah ada, tambah quantity
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Jika belum ada, tambah item baru
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Handle update quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Handle konfirmasi pesanan
  const handleConfirmOrder = () => {
    console.log('Order Data:', orderData);
    console.log('Cart Items:', cartItems);
    
    // TODO: Implement API call atau navigasi ke halaman berikutnya
    alert('Pesanan dikonfirmasi! (Lihat console untuk data)');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Menu Section */}
          <div className="col-span-8">
            {/* Order Header */}
            <OrderHeader 
              orderType={orderType} 
              onDataChange={setOrderData}
            />

            {/* Category Filter */}
            <CategoryFilter onCategoryChange={setSelectedCategory} />

            {/* Menu Grid */}
            <MenuGrid 
              items={filteredMenu}
              onItemClick={handleMenuItemClick}
            />
          </div>

          {/* Right Side - Cart */}
          <div className="col-span-4">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}