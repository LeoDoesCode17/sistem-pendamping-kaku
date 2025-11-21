// MenuGrid.tsx
'use client';

import { Menu } from '@/models/menu';
import MenuCard from './MenuCard';

interface MenuGridProps {
  items: Menu[];
  onItemClick: (item: Menu) => void;
}

export default function MenuGrid({ items, onItemClick }: MenuGridProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}