// features/orders/components/CategoryFilter.tsx
'use client';

import { useState } from 'react';
import { CATEGORIES, CategoryId } from '../constants/categories';

interface CategoryFilterProps {
  onCategoryChange?: (category: CategoryId) => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

  const handleCategoryClick = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-6 py-3 rounded-lg font-semibold text-base transition-colors border-2 border-black  ${
            activeCategory === category.id
              ? 'bg-maroon text-cream'
              : 'bg-cream text-maroon'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}