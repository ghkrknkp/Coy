import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MatchModal({ match, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen || !match) return null;

  const matchedUser = match.matchedUser;

  const handleGoToMatches = () => {
    onClose();
    navigate('/matches');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18111B]/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden border border-[#F3DCE8]"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#FFF1F7] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#FCE7F3] rounded-full blur-3xl pointer-events-none" />

          {/* Sparkle Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 350 }}
            className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#EC4899] to-[#DB2777] text-white flex items-center justify-center shadow-btn-like mb-3"
          >
            <Sparkles className="w-7 h-7 fill-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#18111B] tracking-tight">
            It's a Match! 💕
          </h2>
          <p className="mt-1.5 text-sm text-[#786B78]">
            You and <strong className="text-[#18111B] font-bold">{matchedUser.name}</strong> liked each other.
          </p>

          {/* Privacy Guarantee Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF1F7] border border-[#F3DCE8] rounded-full text-[11px] font-semibold text-[#DB2777]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Mutual privacy verified</span>
          </div>

          {/* Dual Avatars */}
          <div className="flex items-center justify-center gap-3 my-6 sm:my-8">
            {/* Demo User Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-[#FCE7F3] overflow-hidden bg-neutral-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[#18111B] text-white text-[10px] font-bold rounded-full">
                You
              </span>
            </div>

            {/* Pulsing Center Heart */}
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#DB2777] text-white flex items-center justify-center shadow-btn-like z-10 -mx-3"
            >
              <Heart className="w-5 h-5 fill-white stroke-white" />
            </motion.div>

            {/* Matched User Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-[#EC4899] overflow-hidden bg-neutral-200 shadow-md">
                <img
                  src={matchedUser.image_url}
                  alt={matchedUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -left-1 px-2.5 py-0.5 bg-[#EC4899] text-white text-[10px] font-bold rounded-full">
                {matchedUser.name}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <motion.button
              type="button"
              onClick={handleGoToMatches}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white font-bold text-sm shadow-btn-like hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with {matchedUser.name}</span>
            </motion.button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-5 rounded-full bg-[#FFF1F7] hover:bg-[#FCE7F3] text-[#786B78] hover:text-[#18111B] font-semibold text-xs transition-colors"
            >
              Keep Discovering
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
