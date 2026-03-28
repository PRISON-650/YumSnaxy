import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShoppingBag, Sparkles } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const { user, logout, isAdmin, isSuperAdmin, isStaff } = useAuth();

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 z-20 overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-100">
              <p className="text-sm font-bold text-neutral-900 truncate">{user.displayName || 'User'}</p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              <div className="mt-2 px-2 py-1 bg-neutral-100 rounded-lg flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Role: {user.role}</p>
                {isSuperAdmin && <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Super Admin</p>}
              </div>
            </div>
            
            <div className="p-2">
              {isStaff && (
                <Link to="/cashier" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-orange-600 rounded-lg transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  POS (Cashier)
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-orange-600 rounded-lg transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/specials" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-orange-600 rounded-lg transition-colors">
                  <Sparkles className="w-4 h-4" />
                  Specials & Deals
                </Link>
              )}
              <Link to="/orders" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-orange-600 rounded-lg transition-colors">
                <ShoppingBag className="w-4 h-4" />
                My Orders
              </Link>
            </div>

            <div className="p-2 border-t border-neutral-100">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
