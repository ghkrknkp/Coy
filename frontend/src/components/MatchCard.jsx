import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, MessageCircle, Heart } from 'lucide-react';
import InterestTags from './InterestTags.jsx';

export default function MatchCard({ match, onChatClick }) {
  if (!match) return null;
  const profile = match.profile;

  const formatDate = (dateString) => {
    if (!dateString) return 'Matched recently';
    try {
      const date = new Date(dateString);
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) return 'Matched today';
      return `Matched ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } catch {
      return 'Matched recently';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F3DCE8] shadow-card-soft hover:shadow-card-hover transition-all flex flex-col sm:flex-row items-center gap-4 group"
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-[#FFF1F7]">
        <img
          src={profile.image_url}
          alt={profile.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm text-[#EC4899] flex items-center justify-center shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-[#EC4899] stroke-[#EC4899]" />
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 w-full text-center sm:text-left flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-[#18111B]">
              {profile.name}, {profile.age}
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-xs text-[#786B78]">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>{profile.location}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#DB2777] font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(match.matchedAt)}</span>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-1.5 text-xs text-[#786B78] line-clamp-2 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {profile.interests && (
            <div className="mt-2.5 flex justify-center sm:justify-start">
              <InterestTags interests={profile.interests} limit={3} />
            </div>
          )}
        </div>
      </div>

      {/* Action Button: Chat Soon */}
      <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex justify-center">
        <motion.button
          type="button"
          onClick={() => (onChatClick ? onChatClick(profile) : alert(`Direct messaging with ${profile.name} is coming soon!`))}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FFF1F7] hover:bg-[#FCE7F3] border border-[#F3DCE8] text-[#DB2777] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>Chat Soon</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

