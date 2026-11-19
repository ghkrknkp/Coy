import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';

export default function SwipeButtons({ onPass, onLike, disabled = false, size = 'default' }) {
  const isLarge = size === 'large';

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-7 select-none">
      {/* Pass Button */}
      <motion.button
        type="button"
        onClick={onPass}
        disabled={disabled}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        aria-label="Pass"
        className={`rounded-full bg-white border border-[#F3DCE8] text-[#F04465] flex items-center justify-center shadow-md hover:shadow-lg hover:border-[#F472B6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isLarge ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-14 h-14 sm:w-16 sm:h-16'
        }`}
      >
        <X className={`${isLarge ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6 sm:w-7 sm:h-7'} stroke-[2.5]`} />
      </motion.button>

      {/* Like Button */}
      <motion.button
        type="button"
        onClick={onLike}
        disabled={disabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        aria-label="Like"
        className={`rounded-full bg-gradient-to-tr from-[#EC4899] to-[#DB2777] text-white flex items-center justify-center shadow-btn-like hover:brightness-105 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          isLarge ? 'w-18 h-18 sm:w-20 sm:h-20' : 'w-16 h-16 sm:w-18 sm:h-18'
        }`}
      >
        <Heart className={`${isLarge ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-7 h-7 sm:w-8 sm:h-8'} fill-white stroke-white`} />
      </motion.button>
    </div>
  );
}

