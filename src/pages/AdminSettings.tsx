import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { toast } from 'sonner';
import { Save, Phone } from 'lucide-react';

export default function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWhatsappNumber(docSnap.data().whatsappNumber || '');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        whatsappNumber
      }, { merge: true });
      toast.success('Settings saved successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-2">Manage general application settings.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Phone className="w-5 h-5 text-orange-600" />
          Contact Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">WhatsApp Order Number</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. +923001234567"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <p className="text-xs text-neutral-500 mt-2">Include country code (e.g., +92). This number will be used for the "Order by Call" button.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
