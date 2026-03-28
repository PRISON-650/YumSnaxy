import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Package, CheckCircle2, Truck, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Order, OrderStatus } from '../../types';
import { cn } from '../../lib/utils';

const STATUS_ICONS: Record<OrderStatus, any> = {
  pending: ShoppingBag,
  preparing: Package,
  ready: CheckCircle2,
  delivered: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-orange-500',
  preparing: 'bg-blue-500',
  ready: 'bg-purple-500',
  delivered: 'bg-green-500',
  completed: 'bg-neutral-900',
  cancelled: 'bg-red-500',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'New Order Received',
  preparing: 'Order is being Prepared',
  ready: 'Order is Ready for Pickup',
  delivered: 'Order has been Delivered',
  completed: 'Order has been Completed',
  cancelled: 'Order has been Cancelled',
};

interface CustomerNotificationProps {
  order: Order;
  t: any;
}

export default function CustomerNotification({ order, t }: CustomerNotificationProps) {
  const Icon = STATUS_ICONS[order.status as OrderStatus] || Info;
  const color = STATUS_COLORS[order.status as OrderStatus] || 'bg-neutral-500';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-1.5 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-3 max-w-[280px] w-full group"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md transition-transform group-hover:scale-105", color)}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-[8px] font-black text-neutral-400 uppercase tracking-widest leading-none">Update</h4>
        <p className="text-xs font-black tracking-tight text-neutral-900 leading-tight truncate">
          {STATUS_LABELS[order.status as OrderStatus]}
        </p>
        <p className="text-[9px] font-bold text-neutral-500">
          Order #{order.id.slice(-4).toUpperCase()}
        </p>
      </div>

      <button onClick={() => toast.dismiss(t)} className="p-1 hover:bg-neutral-50 rounded-full transition-colors">
        <XCircle className="w-4 h-4 text-neutral-300" />
      </button>
    </motion.div>
  );
}
