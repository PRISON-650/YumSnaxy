import React, { createContext, useContext, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';
import { Bell, ShoppingBag, Package, CheckCircle2, Truck, XCircle, Info, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

import AdminNotification from './notifications/AdminNotification';
import CustomerNotification from './notifications/CustomerNotification';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'system';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isCashier } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('snaxy_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse notifications from localStorage:', error);
      return [];
    }
  });
  const adminInitialLoad = useRef(true);
  const customerInitialLoad = useRef(true);

  useEffect(() => {
    localStorage.setItem('snaxy_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;

    let unsubscribeAdmin: (() => void) | undefined;
    if (isAdmin || isCashier) {
      const adminQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      unsubscribeAdmin = onSnapshot(adminQuery, (snapshot) => {
        if (adminInitialLoad.current) {
          adminInitialLoad.current = false;
          return;
        }

        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const order = { id: change.doc.id, ...change.doc.data() } as Order;
            if (order.status !== 'pending') return;

            addNotification({
              title: 'New Order',
              message: `Order #${order.id.slice(-4)} received for ${formatCurrency(order.total)}`,
              type: 'order',
              orderId: order.id,
            });

            toast.custom((t) => (
              <AdminNotification 
                order={order} 
                t={t} 
                onClick={() => {
                  navigate('/admin/orders');
                  toast.dismiss(t);
                }} 
              />
            ), { duration: 8000 });

            new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
          }
        });
      }, (error) => {
        console.warn('Admin notification listener error:', error);
      });
    }

    const customerQuery = query(collection(db, 'orders'), where('customerId', '==', user.uid));
    const unsubscribeCustomer = onSnapshot(customerQuery, (snapshot) => {
      if (customerInitialLoad.current) {
        customerInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const order = { id: change.doc.id, ...change.doc.data() } as Order;
          
          addNotification({
            title: 'Order Updated',
            message: `Your order #${order.id.slice(-4)} is now ${order.status}`,
            type: 'order',
            orderId: order.id,
          });

          toast.custom((t) => (
            <CustomerNotification 
              order={order} 
              t={t} 
            />
          ), { duration: 8000 });
        }
      });
    }, (error) => {
      console.warn('Customer notification listener error:', error);
    });

    return () => {
      unsubscribeAdmin?.();
      unsubscribeCustomer();
    };
  }, [user, isAdmin, isCashier]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
