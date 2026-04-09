import React from 'react';
import { Link } from 'react-router-dom';
import { X, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: any[];
}

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const { user, logout, isAdmin, isStaff } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl md:hidden flex flex-col"
          >
            <div className="p-4 h-16 flex items-center justify-between border-b border-neutral-100">
              <span className="font-bold text-orange-600">Menu</span>
              <button onClick={onClose} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors",
                    window.location.pathname === item.path ? "bg-orange-50 text-orange-600" : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.name}
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="h-px bg-neutral-100 my-2" />
                  <Link to="/orders" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-neutral-600 hover:bg-neutral-50">
                    <ShoppingBag className="w-5 h-5" />
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-neutral-600 hover:bg-neutral-50">
                      <LayoutDashboard className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-neutral-100">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=ea580c&color=fff`} alt={user.displayName} className="w-10 h-10 rounded-full border border-neutral-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-neutral-900 truncate">{user.displayName}</p>
                      <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="h-1" />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
