'use client';

import { MenuItem } from '../types/menu';

interface MenuCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export default function MenuCard({ item, onClick }: MenuCardProps) {
  return (
    <button
      onClick={() => onClick(item)}
      className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-red-800 hover:shadow-md transition-all text-left"
    >
      <h3 className="text-lg font-bold text-red-900">{item.name}</h3>
    </button>
  );
}