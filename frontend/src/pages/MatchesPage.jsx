import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Compass, ShieldCheck } from 'lucide-react';
import MatchCard from '../components/MatchCard.jsx';
import ChatModal from '../components/ChatModal.jsx';
import api from '../services/api.js';

export default function MatchesPage({ onMatchCountUpdate }) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChatMatch, setActiveChatMatch] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMatches() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.getMatches();
        if (res.success) {
          setMatches(res.data);
          if (onMatchCountUpdate) onMatchCountUpdate(res.data.length);
        }
      } catch (err) {
        console.error('Failed to load matches:', err);
        setError('Failed to load mutual matches. Please ensure the backend is running.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMatches();
  }, [onMatchCountUpdate]);

  const handleOpenChat = (matchItem) => {
    setActiveChatMatch(matchItem);
    setIsChatOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full py-4 sm:py-8 px-4 sm:px-8 pb-24 lg:pb-8 max-w-4xl"
    >
      {/* Header matching 3rd mockup screen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-black text-[#18111B] tracking-tight">
              Matches
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FCE7F3] text-[#DB2777]">
              {matches.length}
            </span>
          </div>
          <p className="text-sm font-medium text-[#786B78] mt-1">
            It's a match! 💕 Click "Chat Soon" to start a conversation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/discover')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#F3DCE8] hover:bg-[#FFF1F7] text-xs font-bold text-[#DB2777] transition-all shadow-sm self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-[#EC4899]" />
          <span>Keep Discovering</span>
        </button>
      </div>

      {/* Coy Privacy Assurance Card */}
      <div className="mb-6 p-4 rounded-3xl bg-white border border-[#F3DCE8] shadow-card-soft flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-[#FFF1F7] text-[#EC4899] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-[#18111B] uppercase tracking-wider">
            Coy Core Privacy Guarantee
          </h2>
          <p className="text-xs text-[#786B78] mt-0.5 leading-relaxed">
            Profiles only appear here when <strong className="text-[#18111B]">both of you</strong> mutually liked each other. One-sided likes are strictly never shown.
          </p>
        </div>
      </div>

      {/* Matches Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl p-4 border border-[#F3DCE8] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-[#FFF1F7] text-[#F04465] rounded-3xl text-center text-sm font-semibold border border-[#F3DCE8]">
          {error}
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((item) => (
            <MatchCard
              key={item.matchId || item.profile.id}
              match={item}
              onChatClick={() => handleOpenChat(item)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-10 p-8 sm:p-12 bg-white rounded-3xl border border-[#F3DCE8] shadow-card-soft text-center flex flex-col items-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#FFF1F7] text-[#EC4899] flex items-center justify-center mb-4 shadow-sm">
            <Heart className="w-8 h-8 fill-[#FCE7F3] stroke-[#EC4899]" />
          </div>

          <h3 className="text-xl font-extrabold text-[#18111B]">
            No mutual matches yet. Keep discovering!
          </h3>

          <p className="text-xs text-[#786B78] mt-1.5 leading-relaxed max-w-xs">
            When someone you like also likes you back, you'll see them right here.
          </p>

          <motion.button
            type="button"
            onClick={() => navigate('/discover')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 py-3 px-6 rounded-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white font-bold text-xs shadow-btn-like flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Go to Discover</span>
          </motion.button>
        </motion.div>
      )}

      {/* Interactive AI Chatbot Modal */}
      <ChatModal
        match={activeChatMatch}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </motion.div>
  );
}
