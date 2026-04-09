import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Edit2, Sparkles, Tag, Check, X, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function AdminSpecials() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'specials' | 'deals'>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    isWeeklySpecial: false,
    dealPrice: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const itemsSnap = await getDocs(collection(db, 'menuItems'));
      setItems(itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
    } catch (error) {
      toast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      isWeeklySpecial: item.isWeeklySpecial || false,
      dealPrice: item.dealPrice?.toString() || '',
      isFeatured: item.isFeatured || false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const data = {
      isWeeklySpecial: formData.isWeeklySpecial,
      dealPrice: formData.dealPrice ? parseFloat(formData.dealPrice) : null,
      isFeatured: formData.isFeatured
    };

    try {
      await updateDoc(doc(db, 'menuItems', editingItem.id), data);
      toast.success('Special/Deal updated successfully');
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'specials' ? item.isWeeklySpecial :
      filter === 'deals' ? (item.dealPrice !== null && item.dealPrice !== undefined) : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tighter">SPECIALS & DEALS</h1>
          <p className="text-neutral-500 text-sm sm:text-base">Manage your weekly specials, featured items, and discounted deals.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 shadow-sm"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm">
            {(['all', 'specials', 'deals'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  filter === f ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            layout
            key={item.id}
            className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {item.isWeeklySpecial && (
                  <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-600/20">
                    <Sparkles className="w-3 h-3" /> Weekly Special
                  </span>
                )}
                {item.dealPrice && (
                  <span className="bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-green-600/20">
                    <Tag className="w-3 h-3" /> Deal Active
                  </span>
                )}
              </div>
              <button
                onClick={() => handleEdit(item)}
                className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-md text-neutral-900 rounded-2xl shadow-lg hover:bg-orange-600 hover:text-white transition-all duration-300 translate-y-12 group-hover:translate-y-0"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-black text-lg tracking-tight line-clamp-1">{item.name}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Price</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-lg font-black tracking-tighter",
                      item.dealPrice ? "text-neutral-300 line-through" : "text-neutral-900"
                    )}>
                      {formatCurrency(item.price)}
                    </span>
                    {item.dealPrice && (
                      <span className="text-xl font-black tracking-tighter text-orange-600">
                        {formatCurrency(item.dealPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Featured</span>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    item.isFeatured ? "text-green-600" : "text-neutral-300"
                  )}>
                    {item.isFeatured ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setEditingItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter">EDIT SPECIAL</h2>
                  <p className="text-neutral-500 text-sm">{editingItem.name}</p>
                </div>
                <button 
                  onClick={() => setEditingItem(null)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Deal Price (PKR)</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.dealPrice}
                        onChange={e => setFormData({ ...formData, dealPrice: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 font-bold"
                        placeholder="Leave empty for no deal"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-400 font-medium">Original price: {formatCurrency(editingItem.price)}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isWeeklySpecial: !formData.isWeeklySpecial })}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                        formData.isWeeklySpecial 
                          ? "bg-orange-50 border-orange-600 text-orange-600" 
                          : "bg-white border-neutral-100 text-neutral-400 hover:border-orange-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold">Weekly Special</span>
                      </div>
                      {formData.isWeeklySpecial && <Check className="w-5 h-5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                        formData.isFeatured 
                          ? "bg-blue-50 border-blue-600 text-blue-600" 
                          : "bg-white border-neutral-100 text-neutral-400 hover:border-blue-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5" />
                        <span className="font-bold">Featured on Home</span>
                      </div>
                      {formData.isFeatured && <Check className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 py-4 bg-neutral-100 text-neutral-600 rounded-2xl font-bold hover:bg-neutral-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
