import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Heart, X, Sparkles } from 'lucide-react';
import InterestTags from './InterestTags.jsx';
import SwipeButtons from './SwipeButtons.jsx';

export default function ProfileCard({
  profile,
  isFront = false,
  onSwipe,
  isSwiping = false,
  dragEnabled = true
}) {
  const x = useMotionValue(0);

  // Rotate card proportionally to drag distance (-18deg on left, +18deg on right per design spec)
  const rotate = useTransform(x, [-220, 0, 220], [-18, 0, 18]);

  // Dynamic stamp opacities
  const likeOpacity = useTransform(x, [30, 110], [0, 1]);
  const passOpacity = useTransform(x, [-30, -110], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (isSwiping || !isFront) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 100;
    const velocityThreshold = 400;

    if (offset > threshold || velocity > velocityThreshold) {
      onSwipe('LIKE');
    } else if (offset < -threshold || velocity < -velocityThreshold) {
      onSwipe('PASS');
    }
  };

  if (!profile) return null;

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: isFront ? 20 : 10,
        transformOrigin: 'bottom center',
        touchAction: 'none'
      }}
      drag={isFront && dragEnabled && !isSwiping ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      initial={isFront ? { scale: 0.95, opacity: 0, y: 15 } : { scale: 0.94, opacity: 0.85, y: 12 }}
      animate={isFront ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.94, opacity: 0.85, y: 12 }}
      transition={{
        type: 'spring',
        damping: 26,
        stiffness: 280,
        duration: 0.35
      }}
      className="absolute top-0 left-0 w-full bg-white rounded-3xl sm:rounded-[32px] border border-[#F3DCE8] shadow-card-soft sm:shadow-card-hover overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* Decorative Sparkle Doodles on Desktop (matches top reference image) */}
      <div className="hidden sm:block absolute -top-3 -right-3 text-[#EC4899]/70 pointer-events-none z-30">
        <Sparkles className="w-8 h-8 fill-[#FFF1F7]" />
      </div>

      {/* Dynamic Drag Stamps (Visible when dragging) */}
      {isFront && (
        <>
          {/* LIKE Stamp (Green #16A36A) */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-40 pointer-events-none border-[3.5px] border-[#16A36A] bg-white/95 backdrop-blur-md text-[#16A36A] font-black tracking-wider text-xl sm:text-2xl px-4 py-1 rounded-2xl transform -rotate-12 shadow-md flex items-center gap-1.5"
          >
            <Heart className="w-5 h-5 fill-[#16A36A] stroke-[#16A36A]" />
            <span>LIKE</span>
          </motion.div>

          {/* PASS Stamp (Pink/Red #F04465) */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-6 z-40 pointer-events-none border-[3.5px] border-[#F04465] bg-white/95 backdrop-blur-md text-[#F04465] font-black tracking-wider text-xl sm:text-2xl px-4 py-1 rounded-2xl transform rotate-12 shadow-md flex items-center gap-1.5"
          >
            <X className="w-5 h-5 stroke-[3] text-[#F04465]" />
            <span>PASS</span>
          </motion.div>
        </>
      )}

      {/* Card Body: Desktop Split View vs Mobile Stacked View */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Profile Image Section */}
        <div className="relative w-full sm:w-[52%] aspect-[4/5] sm:aspect-auto sm:min-h-[440px] overflow-hidden sm:p-3">
          <div className="w-full h-full rounded-2xl sm:rounded-2xl overflow-hidden bg-[#FFF1F7] relative">
            <img
              src={profile.image_url}
              alt={profile.name}
              className="w-full h-full object-cover transition-transform duration-500 pointer-events-none"
              loading={isFront ? 'eager' : 'lazy'}
            />
            {/* Mobile Gradient Scrim */}
            <div className="sm:hidden absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Mobile on-photo title */}
            <div className="sm:hidden absolute bottom-3 left-4 right-4 text-white z-20">
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black tracking-tight drop-shadow-sm">
                  {profile.name}, {profile.age}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/90 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info Details Section */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
          <div className="space-y-3 sm:space-y-4">
            {/* Desktop Name and Age */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18111B] tracking-tight">
                  {profile.name}, {profile.age}
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#786B78]">
                <MapPin className="w-4 h-4 text-[#EC4899]" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-[#786B78] leading-relaxed line-clamp-3">
              {profile.bio}
            </p>

            {/* Interest Tags */}
            <div className="pt-1">
              <InterestTags interests={profile.interests} limit={4} />
            </div>
          </div>

          {/* Desktop Embedded Swipe Buttons (Matching Desktop Mockup in Image!) */}
          <div className="hidden sm:flex items-center justify-start gap-4 pt-6 mt-4 border-t border-[#F3DCE8]/60">
            <SwipeButtons
              onPass={() => onSwipe('PASS')}
              onLike={() => onSwipe('LIKE')}
              disabled={isSwiping}
              size="default"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
