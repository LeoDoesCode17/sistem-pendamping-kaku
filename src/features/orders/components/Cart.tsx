
// features/orders/components/Cart.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { OrderedMenu } from '@/models/ordered-menu';

interface CartProps {
    items: OrderedMenu[];
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
    onConfirmOrder: () => void;
}

export default function Cart({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onConfirmOrder
}: CartProps) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-maroon rounded-lg p-6 h-fit sticky top-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 text-cream">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <h2 className="text-xl font-bold">Keranjang</h2>
                </div>
                <div className="bg-cream text-maroon w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
                {items.length === 0 ? (
                    <div className="bg-white rounded-lg border-2 text-center  py-12">
                        <svg
                            className="w-16 h-16 mx-auto mb-3 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <p className="text-sm opacity-75">Keranjang masih kosong</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg p-4 border-2 border-black"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold flex-1 pr-2">{item.menu.name}</h3>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="bg-maroon  text-cream p-2 rounded transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="bg-cream text-red-900 w-10 h-10 rounded-lg font-bold text-xl transition-colors"
                                >
                                    −
                                </button>
                                <span className="text-2xl font-bold min-w-[3rem] text-center">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="bg-cream text-red-900 w-10 h-10 rounded-lg font-bold text-xl  transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Confirm Button */}
            <button
                onClick={onConfirmOrder}
                disabled={items.length === 0}
                className={`w-full py-4 rounded-lg text-cream font-bold text-lg transition-colors ${items.length === 0
                        ? 'bg-gray-800 opacity-50'
                        : 'bg-maroon2 '
                    }`}
            >
                Konfirmasi Pesanan
            </button>
        </div>
    );
}