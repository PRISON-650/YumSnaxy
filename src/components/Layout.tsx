import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { User as UserIcon, LayoutDashboard, Utensils, ClipboardList, ShoppingBag, FileText, Settings } from 'lucide-react';
import { useAuth } from '../AuthContext';
import CartDrawer from './CartDrawer';
import LoginModal from './LoginModal';
import Header from './layout/Header';
import Footer from './layout/Footer';
import UserDropdown from './layout/UserDropdown';
import MobileMenu from './layout/MobileMenu';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  admin?: boolean;
}

export default function Layout({ children, admin = false }: LayoutProps) {
  const { loading, isSuperAdmin, isCashier } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  const navItems = admin ? [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Menu Items', path: '/admin/menu', icon: Utensils },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'POS (Cashier)', path: '/cashier', icon: ShoppingBag },
    ...(isSuperAdmin ? [
      { name: 'Users', path: '/admin/users', icon: UserIcon },
      { name: 'Settings', path: '/admin/settings', icon: Settings }
    ] : []),
  ] : [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
  ];

  if (isCashier && location.pathname !== '/cashier') {
    return <Navigate to="/cashier" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8 max-w-sm text-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight uppercase text-neutral-900">Yum Snaxy</h2>
            <p className="text-neutral-500 font-medium text-sm animate-pulse">Syncing session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header 
        admin={admin}
        navItems={navItems}
        isUserDropdownOpen={isUserDropdownOpen}
        setIsUserDropdownOpen={setIsUserDropdownOpen}
        setIsCartOpen={setIsCartOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navItems={navItems} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <main className="flex-1">
        {children}
      </main>

      <Footer setIsLoginModalOpen={setIsLoginModalOpen} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
