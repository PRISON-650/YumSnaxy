import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { useCart } from '../../CartContext';
import { useNotifications } from '../NotificationProvider';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import UserDropdown from './UserDropdown';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  admin?: boolean;
  navItems: any[];
  isUserDropdownOpen: boolean;
  setIsUserDropdownOpen: (open: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ 
  admin, 
  navItems, 
  isUserDropdownOpen, 
  setIsUserDropdownOpen, 
  setIsCartOpen, 
  setIsMobileMenuOpen 
}: HeaderProps) {
  const { user, logout, isAdmin, isSuperAdmin, isStaff } = useAuth();
  const { itemCount, isAnimating } = useCart();
  const { unreadCount } = useNotifications();
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-orange-600 tracking-tighter">
            YUM SNAXY
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors",
                  window.location.pathname === item.path ? "text-orange-600" : "text-neutral-600 hover:text-orange-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-neutral-600 hover:text-orange-600 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
          </div>

          {!admin && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-3 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors shadow-sm"
            >
              <motion.div
                animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, -10, 0] } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
              </motion.div>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {itemCount}
                </span>
              )}
            </button>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`} alt={user.displayName} className="w-8 h-8 rounded-full border border-neutral-200" />
                <ChevronDown className={cn("w-4 h-4 text-neutral-500 transition-transform", isUserDropdownOpen && "rotate-180")} />
              </button>
              <UserDropdown isOpen={isUserDropdownOpen} onClose={() => setIsUserDropdownOpen(false)} />
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-neutral-600"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
