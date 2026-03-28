import React from 'react';
import { Star, Zap } from 'lucide-react';
import { Category } from '../../types';
import { cn } from '../../lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          "px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all",
          activeCategory === 'all' ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
        )}
      >
        All Items
      </button>
      <button
        onClick={() => onSelect('specials')}
        className={cn(
          "px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-2",
          activeCategory === 'specials' ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100"
        )}
      >
        <Star className="w-4 h-4" /> Weekly Specials
      </button>
      <button
        onClick={() => onSelect('deals')}
        className={cn(
          "px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-2",
          activeCategory === 'deals' ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
        )}
      >
        <Zap className="w-4 h-4" /> Hot Deals
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "px-8 py-3 rounded-full font-bold whitespace-nowrap transition-all",
            activeCategory === cat.id ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
