import React from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({ onResetDemo, isResetting = false, matchCount = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm sm:max-w-md mx-auto my-auto p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-card-soft border border-[#F3DCE8] text-center flex flex-col items-center select-none"
    >
      {/* Floating Dual Pink Hearts Graphic matching mockup */}
      <div className="relative mb-6 w-32 h-28 flex items-center justify-center">
        {/* Soft Pink Cloud Background */}
        <div className="absolute inset-0 bg-[#FFF1F7] rounded-full blur-xl scale-95" />

        {/* Floating Sparkle Stars */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="absolute -top-1 right-2 text-amber-400"
        >
          <Sparkles className="w-5 h-5 fill-amber-300" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: 'easeInOut' }}
          className="absolute bottom-2 left-1 text-amber-400"
        >
          <Sparkles className="w-4 h-4 fill-amber-300" />
        </motion.div>

        {/* Dual Animated Hearts */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-10, -5, -10] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#F472B6] text-white flex items-center justify-center shadow-btn-like"
          >
            <Heart className="w-10 h-10 fill-white stroke-white" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [12, 18, 12] }}
            transition={{ repeat: Infinity, duration: 2.7, delay: 0.3, ease: 'easeInOut' }}
            className="w-13 h-13 -ml-4 -mt-3 rounded-2xl bg-gradient-to-tr from-[#DB2777] to-[#EC4899] text-white flex items-center justify-center shadow-md"
          >
            <Heart className="w-8 h-8 fill-white stroke-white" />
          </motion.div>
        </div>
      </div>

      {/* Main Text */}
      <h3 className="text-2xl font-extrabold text-[#18111B] tracking-tight">
        You've seen everyone for now!
      </h3>

      <p className="mt-2 text-sm text-[#786B78] leading-relaxed max-w-xs">
        Check your matches or come back later.
      </p>

      {/* Action Buttons */}
      <div className="w-full mt-7 space-y-3">
        {/* View Matches Button */}
        <motion.button
          type="button"
          onClick={() => navigate('/matches')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white font-bold text-sm shadow-btn-like hover:brightness-105 transition-all flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white stroke-white" />
          <span>View Matches {matchCount > 0 && `(${matchCount})`}</span>
        </motion.button>

        {/* Reset Demo Button */}
        {onResetDemo && (
          <button
            type="button"
            onClick={onResetDemo}
            disabled={isResetting}
            className="w-full py-2.5 px-4 rounded-full border border-[#F3DCE8] bg-white hover:bg-[#FFF1F7] text-[#786B78] hover:text-[#EC4899] font-medium text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Deck</span>
          </button>
        )}
      </div>

      <p className="mt-6 text-[11px] text-[#786B78]/70">
        Coy Guarantee: Previously swiped profiles will never reappear.
      </p>
    </motion.div>
  );
}
