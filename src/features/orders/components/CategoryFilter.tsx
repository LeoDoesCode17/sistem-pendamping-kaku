// features/orders/components/CategoryFilter.tsx
"use client";

import { useState } from "react";
import { CategoryId } from "../constants/categories";
import { MenuCategory } from "@/types/menu-category";

interface CategoryFilterProps {
  onCategoryChange?: (category: CategoryId) => void;
  myOnCategoryChange?: (category: MenuCategory | string) => void;
}

export default function CategoryFilter({
  myOnCategoryChange
}: CategoryFilterProps) {

  const [myActiveCategory, setMyActiveCategory] = useState<string>("all");

  const myHandleCategoryClick = (category: MenuCategory | string) => {
    setMyActiveCategory(category);
    myOnCategoryChange?.(category);
  };

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
              <button
          key="all"
          onClick={() => myHandleCategoryClick("all")}
          className={`px-6 py-3 rounded-lg font-semibold text-base transition-colors border-2 border-black  ${
            myActiveCategory === "all"
              ? "bg-maroon text-cream"
              : "bg-cream text-maroon"
          }`}
        >
          ALL
        </button>
      {Object.values(MenuCategory).map((menuCategory) => (
        <button
          key={menuCategory}
          onClick={() => myHandleCategoryClick(menuCategory)}
          className={`px-6 py-3 rounded-lg font-semibold text-base transition-colors border-2 border-black  ${
            myActiveCategory === menuCategory
              ? "bg-maroon text-cream"
              : "bg-cream text-maroon"
          }`}
        >
          {menuCategory}
        </button>
      ))}
    </div>
  );
}
