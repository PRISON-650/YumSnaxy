import React from 'react';
import { Bell, X, CheckCircle2, Package, Truck, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications, Notification } from '../NotificationProvider';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-orange-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-black uppercase tracking-tight text-neutral-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-600 transition-colors"
                >
                  Mark all read
                </button>
                <button 
                  onClick={clearNotifications}
                  className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-6 h-6 text-neutral-300" />
                  </div>
                  <p className="text-sm font-bold text-neutral-400 uppercase tracking-tight">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        "p-4 hover:bg-neutral-50 transition-colors cursor-pointer relative group",
                        !notif.read && "bg-orange-50/30"
                      )}
                    >
                      {!notif.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600" />
                      )}
                      <div className="flex gap-3">
                        <div className="mt-1">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-neutral-900 leading-tight mb-1">{notif.title}</p>
                          <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{notif.message}</p>
                          <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-neutral-50 border-t border-neutral-100 text-center">
                <button 
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-orange-600 transition-colors"
                >
                  Close Panel
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
