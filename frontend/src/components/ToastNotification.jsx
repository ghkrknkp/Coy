import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastNotification({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-[#F3DCE8] shadow-lg text-sm font-medium text-[#18111B]"
      >
        <div className="w-6 h-6 rounded-full bg-[#FFF1F7] text-[#EC4899] flex items-center justify-center shrink-0">
          {type === 'success' ? (
            <Sparkles className="w-3.5 h-3.5 fill-[#EC4899]" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-[#F04465]" />
          )}
        </div>
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#786B78] hover:text-[#18111B] transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

