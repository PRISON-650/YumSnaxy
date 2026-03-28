import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

interface FooterProps {
  setIsLoginModalOpen: (open: boolean) => void;
}

export default function Footer({ setIsLoginModalOpen }: FooterProps) {
  const { user } = useAuth();

  return (
    <footer className="bg-white border-t border-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-xl font-bold text-orange-600 mb-4">YUM SNAXY</h3>
          <p className="text-neutral-500 max-w-sm">
            Lightning-fast online ordering for your favorite fast food. Fresh ingredients, bold flavors, delivered in minutes.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-neutral-500">
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/checkout">Cart</Link></li>
            <li><Link to="/">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-neutral-500">
            <li>support@yumsnaxy.com</li>
            <li>+92 332 6750700-YUM-SNAXY</li>
            <li>Yum Snaxy, Red Town , Dhoke Ratta, Rawalpindi</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-400 text-sm">
        <p>© 2026 Yum Snaxy. All rights reserved.</p>
        {!user && (
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="text-[10px] uppercase tracking-widest font-bold hover:text-orange-600 transition-colors"
          >
            Staff Portal
          </button>
        )}
      </div>
    </footer>
  );
}
