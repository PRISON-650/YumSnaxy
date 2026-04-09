import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { db } from '../firebase';
import { MenuItem, Category } from '../types';
import MenuItemCard from '../components/MenuItemCard';
import MenuItemModal from '../components/MenuItemModal';
import CategoryFilter from '../components/menu/CategoryFilter';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchCategories = async () => {
      const catsSnap = await getDocs(query(collection(db, 'categories'), orderBy('order')));
      setCategories(catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let itemsQuery;
      if (activeCategory === 'specials') {
        itemsQuery = query(collection(db, 'menuItems'), where('isWeeklySpecial', '==', true), where('isAvailable', '==', true));
      } else if (activeCategory === 'deals') {
        itemsQuery = query(collection(db, 'menuItems'), where('dealPrice', '!=', null), where('isAvailable', '==', true));
      } else if (activeCategory !== 'all') {
        itemsQuery = query(collection(db, 'menuItems'), where('categoryId', '==', activeCategory), where('isAvailable', '==', true));
      } else {
        itemsQuery = query(collection(db, 'menuItems'), where('isAvailable', '==', true));
      }
      
      const itemsSnap = await getDocs(itemsQuery);
      setItems(itemsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as MenuItem)));
      setLoading(false);
    };
    fetchItems();
  }, [activeCategory]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter">OUR MENU</h1>
          <p className="text-neutral-500">Freshly prepared meals delivered to your doorstep</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for burgers, fries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
          />
        </div>
      </div>

      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelect={(catId) => setSearchParams(catId === 'all' ? {} : { category: catId })} 
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8"> 
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl sm:rounded-[2.5rem] h-48 sm:h-96 animate-pulse border border-neutral-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8"> 
          {filteredItems.map((item, idx) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              index={idx}
              categoryName={categories.find(c => c.id === item.categoryId)?.name}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      )}

      <MenuItemModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}
