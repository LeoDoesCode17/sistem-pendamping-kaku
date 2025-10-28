// features/cashier/components/OrderFilterBar.tsx
'use client';

import { useState } from 'react';
import { FilterOptions } from '../types/order-history';
import { OrderType } from '@/features/orders/types/order';

interface OrderFilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const ORDER_TYPES: { value: OrderType | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua Tipe' },
  { value: 'dine-in', label: 'Dine In' },
  { value: 'take-away', label: 'Take Away' },
  { value: 'grab-food', label: 'Grab Food' },
  { value: 'go-food', label: 'Go Food' },
  { value: 'shopee-food', label: 'Shopee Food' },
  { value: 'wa-order', label: 'WA Order' }
];

export default function OrderFilterBar({ onFilterChange }: OrderFilterBarProps) {
  const [selectedType, setSelectedType] = useState<OrderType | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleTypeChange = (type: OrderType | 'all') => {
    setSelectedType(type);
    applyFilters(type, startDate, endDate);
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    applyFilters(selectedType, start, end);
  };

  const applyFilters = (type: OrderType | 'all', start: string, end: string) => {
    const filters: FilterOptions = {};

    if (type !== 'all') {
      filters.orderType = type;
    }

    if (start && end) {
      filters.dateRange = {
        start: new Date(start),
        end: new Date(end)
      };
    }

    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Tanggal:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value, endDate)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange(startDate, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
          />
        </div>

        {/* Order Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Tipe Order:</label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value as OrderType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
          >
            {ORDER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}