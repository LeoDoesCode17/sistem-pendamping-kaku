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
      className="bg-white p-6 rounded-lg border-2 border-gray-400 transition-all text-left"
    >
      <h3 className="text-lg font-bold text-maroon">{item.name}</h3>
    </button>
  );
}