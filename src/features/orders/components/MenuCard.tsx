'use client';

import { Menu } from '@/models/menu';

interface MenuCardProps {
  item: Menu;
  onClick: (item: Menu) => void;
}

export default function MenuCard({ item, onClick }: MenuCardProps) {
  const label = item.name + ` (${item.abbreviation})`
  return (
    <button
      onClick={() => onClick(item)}
      className="bg-white p-6 rounded-lg border-2 border-gray-400 transition-all text-left"
    >
      <h3 className="text-lg font-bold text-maroon">{label}</h3>
    </button>
  );
}