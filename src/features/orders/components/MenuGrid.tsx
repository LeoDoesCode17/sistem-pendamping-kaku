'use client';

import { Menu } from '@/models/menu';
import MenuCard from './MenuCard';

interface MenuGridProps {
  items: Menu[];
  onItemClick: (item: Menu) => void;
}

export default function MenuGrid({ items, onItemClick }: MenuGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}