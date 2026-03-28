import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-8 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>

            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
              variant === 'danger' ? "bg-red-100 text-red-600" :
              variant === 'warning' ? "bg-orange-100 text-orange-600" :
              "bg-blue-100 text-blue-600"
            )}>
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black tracking-tighter mb-2">{title}</h2>
            <p className="text-neutral-500 text-sm mb-8">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-neutral-100 text-neutral-600 rounded-2xl font-bold hover:bg-neutral-200 transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  "flex-[2] py-4 text-white rounded-2xl font-bold transition-all shadow-xl",
                  variant === 'danger' ? "bg-red-600 hover:bg-red-700 shadow-red-200" :
                  variant === 'warning' ? "bg-orange-600 hover:bg-orange-700 shadow-orange-200" :
                  "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                )}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
