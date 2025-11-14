// features/cashier/components/OrderDetailTable.tsx
'use client';

import { OrderedMenu } from '@/models/ordered-menu';

interface TransactionDetailTableProps {
  items: OrderedMenu[];
}

export default function TransactionDetailTable({ items }: TransactionDetailTableProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
              Nama Item
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 w-32">
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index !== items.length - 1 ? 'border-b border-gray-200' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              <td className="px-6 py-4 text-gray-800">
                <span className="font-semibold">{item.menu.name}</span>
                <span className="text-gray-500 ml-2">({item.menu.abbreviation})</span>
              </td>
              <td className="px-6 py-4 text-center font-bold text-maroon">
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}