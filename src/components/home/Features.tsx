import React from 'react';
import { Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4 text-center p-8 rounded-[3rem] bg-orange-50">
          <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold">Fast Delivery</h3>
          <p className="text-neutral-500">Your food arrives hot and fresh in under 30 minutes, guaranteed.</p>
        </div>
        <div className="space-y-4 text-center p-8 rounded-[3rem] bg-neutral-100">
          <div className="w-16 h-16 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold">Quality Food</h3>
          <p className="text-neutral-500">We use only the freshest ingredients from local suppliers.</p>
        </div>
        <div className="space-y-4 text-center p-8 rounded-[3rem] bg-orange-50">
          <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold">Best Service</h3>
          <p className="text-neutral-500">Our customer support is available 24/7 to help you with your order.</p>
        </div>
      </div>
    </section>
  );
}
