import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MenuItem, Category } from '../types';
import MenuItemModal from '../components/MenuItemModal';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import FeaturedItems from '../components/home/FeaturedItems';
import Features from '../components/home/Features';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specialsQuery = query(collection(db, 'menuItems'), where('isWeeklySpecial', '==', true), limit(4));
        
        const [specialsSnap, catsSnap] = await Promise.all([
          getDocs(specialsQuery),
          getDocs(collection(db, 'categories'))
        ]);
        
        setFeaturedItems(specialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
        setCategories(catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'menuItems/categories');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <Categories categories={categories} />
      <FeaturedItems items={featuredItems} onSelectItem={setSelectedItem} />
      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <Features />
    </div>
  );
}
