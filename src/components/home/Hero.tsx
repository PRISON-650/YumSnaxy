import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Phone } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Hero() {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().whatsappNumber) {
          setWhatsappNumber(docSnap.data().whatsappNumber);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleCallOrder = () => {
    if (whatsappNumber) {
      // Remove any non-numeric characters except +
      const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=Hi,%20I%20would%20like%20to%20place%20an%20order.`, '_blank');
    }
  };

  return (
    <section className="relative h-[85vh] min-h-[500px] flex items-center overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-5 sm:space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-600/30 text-orange-500 px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase">
            <Zap className="w-4 h-4" />
            Fastest Delivery in Town
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            CRAVE IT.<br />
            <span className="text-orange-600">ORDER IT.</span><br />
            EAT IT.
          </h1>
          
          <p className="text-base sm:text-xl text-neutral-300 max-w-lg leading-relaxed">
            Yum Snaxy delivers your favorite fast food in under 30 minutes. Fresh, hot, and straight to your door.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/menu"
              className="bg-orange-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-all hover:scale-105 shadow-xl shadow-orange-600/20"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </Link>
            {whatsappNumber && (
              <button
                onClick={handleCallOrder}
                className="bg-[#25D366] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all hover:scale-105 shadow-xl shadow-[#25D366]/20"
              >
                <Phone className="w-5 h-5" />
                Order by Call
              </button>
            )}
            {!whatsappNumber && (
              <Link
                to="/menu"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
              >
                View Menu
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-white">30k+</span>
              <span className="text-xs sm:text-sm text-neutral-400">Happy Customers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-white">4.9/5</span>
              <span className="text-xs sm:text-sm text-neutral-400">Average Rating</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-white">20min</span>
              <span className="text-xs sm:text-sm text-neutral-400">Avg. Delivery</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
