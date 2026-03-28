import React from 'react';
import { motion } from 'motion/react';
import { Bell, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface AdminNotificationProps {
  order: Order;
  t: any;
  onClick: () => void;
}

export default function AdminNotification({ order, t, onClick }: AdminNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="bg-neutral-900 text-white p-1 rounded-2xl shadow-xl border border-white/10 overflow-hidden max-w-[280px] w-full"
    >
      <div className="bg-orange-600 p-3 rounded-xl flex items-center gap-3 relative overflow-hidden">
        <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/10 rounded-full blur-2xl" />
        
        <div className="w-10 h-10 bg-white text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">New</span>
            <h3 className="text-xs font-black tracking-tighter uppercase truncate">ORDER RECEIVED</h3>
          </div>
          <p className="text-orange-100 font-bold text-[10px]">#{order.id.slice(-4).toUpperCase()}</p>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-white font-black text-sm">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <button onClick={() => toast.dismiss(t)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <XCircle className="w-4 h-4 text-white/60" />
        </button>
      </div>
      
      <div className="px-3 py-1.5 flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
        </div>
        <button onClick={onClick} className="text-[8px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
          View <ArrowRight className="w-2 h-2" />
        </button>
      </div>
    </motion.div>
  );
}
