import React from 'react';
import { MenuItem } from '../../types';
import MenuItemCard from '../MenuItemCard';

interface FeaturedItemsProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export default function FeaturedItems({ items, onSelectItem }: FeaturedItemsProps) {
  return (
    <section className="bg-neutral-100 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-2">WEEKLY SPECIALS</h2>
            <p className="text-neutral-500 text-sm sm:text-base">Hand-picked favorites just for you</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
          {items.map((item, idx) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              index={idx}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
