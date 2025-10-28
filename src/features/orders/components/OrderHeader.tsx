// features/orders/components/OrderHeader.tsx
'use client';

import { useState } from 'react';
import { OrderType, OrderHeaderData } from '../types/order';
import { ORDER_CONFIG } from '../constants/orderConfig';

interface OrderHeaderProps {
  orderType: OrderType;
  onDataChange?: (data: OrderHeaderData) => void;
}

// helper untuk escape prefix ke regex
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Normalisasi orderCode:
// - Hapus semua prefix berulang di depan
// - Jika setelah dihapus tidak ada isi => return ''
// - Jika ada isi => kembalikan prefix + isi (tanpa prefix dobel)
const normalizeOrderCode = (input: string, prefix: string) => {
  let s = input ?? '';
  const re = new RegExp(`^${escapeRegex(prefix)}\\s*`, 'i');
  // buang semua prefix di depan (bisa dobel)
  while (re.test(s)) s = s.replace(re, '');
  if (s.trim().length === 0) return '';             // boleh kosong
  return `${prefix}${s}`;                            // satu prefix saja
};

export default function OrderHeader({ orderType, onDataChange }: OrderHeaderProps) {
  const config = ORDER_CONFIG[orderType];

  const [formData, setFormData] = useState<OrderHeaderData>({
    customerName: '',
    // ❌ jangan prefill dengan prefix, biarin kosong
    orderCode: '',
    phoneNumber: '',
    gofoodCode: '',
  });

  const handleInputChange = (field: keyof OrderHeaderData, value: string) => {
    let newValue = value;

    // ✅ Pertahankan prefix hanya jika ada konten; boleh kosong total
    if (field === 'orderCode' && config.prefix) {
      newValue = normalizeOrderCode(value, config.prefix);
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
            value={formData.customerName ?? ''}
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
            value={formData.gofoodCode ?? ''}
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
            value={formData.orderCode ?? ''}
            onChange={(e) => handleInputChange('orderCode', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-maroon text-black font-medium"
            // ✅ placeholder tampilkan prefix, tapi value boleh kosong
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
            value={formData.phoneNumber ?? ''}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.fields.map(renderField)}
      </div>
    </div>
  );
}
