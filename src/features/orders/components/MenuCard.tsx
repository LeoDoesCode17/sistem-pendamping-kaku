// MenuCard.tsx
'use client';

import { Menu } from '@/models/menu';

interface MenuCardProps {
  item: Menu;
  onClick: (item: Menu) => void;
}

export default function MenuCard({ item, onClick }: MenuCardProps) {
  const label = item.name;
  return (
    <button
      onClick={() => onClick(item)}
      className="bg-white p-4 rounded-lg border-2 border-gray-400 transition-all hover:border-maroon hover:shadow-md flex items-center justify-center min-h-[80px]"
    >
      <h3 className="text-lg font-bold text-maroon text-center">{label}</h3>
    </button>
  );
}