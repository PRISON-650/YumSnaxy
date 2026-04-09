import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types';

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-6 sm:mb-12">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-2">POPULAR CATEGORIES</h2>
          <p className="text-neutral-500 text-sm sm:text-base">Explore our wide range of delicious options</p>
        </div>
        <Link to="/menu" className="text-orange-600 font-bold flex items-center gap-1 hover:underline text-sm sm:text-base whitespace-nowrap ml-4">
          See All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/menu?category=${cat.id}`}
              className="group block bg-white border border-neutral-100 p-3 sm:p-6 rounded-2xl sm:rounded-3xl text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <img src={cat.image || 'https://picsum.photos/seed/food/200/200'} alt={cat.name} className="w-8 h-8 sm:w-12 sm:h-12 object-contain group-hover:invert transition-all" />
              </div>
              <span className="font-bold text-neutral-800 text-xs sm:text-sm">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
