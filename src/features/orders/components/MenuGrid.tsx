'use client';

import { MenuItem } from '../types/menu';
import MenuCard from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
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