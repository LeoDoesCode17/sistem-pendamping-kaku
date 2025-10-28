'use client';

import { useState } from 'react';
import { OrderType, OrderHeaderData } from '../types/order';
import { ORDER_CONFIG } from '../constants/orderConfig';

interface OrderHeaderProps {
  orderType: OrderType;
  onDataChange?: (data: OrderHeaderData) => void;
}

export default function OrderHeader({ orderType, onDataChange }: OrderHeaderProps) {
  const config = ORDER_CONFIG[orderType];

  const [formData, setFormData] = useState<OrderHeaderData>({
    customerName: '',
    orderCode: config.prefix || '',
    phoneNumber: '',
    gofoodCode: '', // ✅ default
  });

  const handleInputChange = (field: keyof OrderHeaderData, value: string) => {
    let newValue = value;

    // Pastikan prefix tetap ada untuk field orderCode yang punya prefix
    if (field === 'orderCode' && config.prefix) {
      if (!value.startsWith(config.prefix)) {
        newValue = config.prefix + value.replace(config.prefix, '');
      }
    }

    const newData = { ...formData, [field]: newValue };
    setFormData(newData);
    onDataChange?.(newData);
  };

  const renderField = (field: string) => {
    const label = config.labels[field as keyof typeof config.labels];

    if (field === 'customerName') {
      return (
        <div key={field} className="flex-1">
          <label className="block text-sm font-semibold text-maroon mb-2">{label}</label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-maroon text-black font-medium"
            placeholder="Masukkan nama"
          />
        </div>
      );
    }

    if (field === 'gofoodCode') {
      return (
        <div key={field} className="flex-1">
          <label className="block text-sm font-semibold text-maroon mb-2">{label}</label>
          <input
            type="text"
            value={formData.gofoodCode}
            onChange={(e) => handleInputChange('gofoodCode', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-maroon text-black font-medium"
            placeholder="Masukkan kode GoFood (opsional)"
          />
        </div>
      );
    }

    if (field === 'orderCode') {
      return (
        <div key={field} className="flex-1">
          <label className="block text-sm font-semibold text-maroon mb-2">{label}</label>
          <input
            type="text"
            value={formData.orderCode}
            onChange={(e) => handleInputChange('orderCode', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-maroon text-black font-medium"
            placeholder={config.prefix ? `${config.prefix}kode pesanan` : 'Masukkan kode'}
          />
        </div>
      );
    }

    if (field === 'phoneNumber') {
      return (
        <div key={field} className="flex-1">
          <label className="block text-sm font-semibold text-maroon mb-2">{label}</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-maroon text-black font-medium"
            placeholder="08xx xxxx xxxx"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-400 mb-6">
      {/* ✅ grid 2 kolom biar rapi untuk 2 input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.fields.map(renderField)}
      </div>
    </div>
  );
}
