import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileCard from './ProfileCard.jsx';
import SwipeButtons from './SwipeButtons.jsx';

export default function CardStack({
  profiles = [],
  onSwipe,
  isSwiping = false
}) {
  const [swipeDirection, setSwipeDirection] = useState(null);

  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  const handleAction = (direction) => {
    if (isSwiping || !currentProfile) return;
    setSwipeDirection(direction);
    onSwipe(currentProfile.id, direction);
  };

  if (!currentProfile) return null;

  return (
    <div className="w-full max-w-sm sm:max-w-2xl mx-auto flex flex-col items-center">
      {/* Cards Deck Container */}
      <div className="relative w-full h-[520px] sm:h-[480px]">
        {/* Next Card in Stack (background layer) */}
        {nextProfile && (
          <ProfileCard
            key={nextProfile.id}
            profile={nextProfile}
            isFront={false}
            dragEnabled={false}
          />
        )}

        {/* Current Active Card (front layer with exit animations) */}
        <AnimatePresence
          mode="wait"
          onExitComplete={() => setSwipeDirection(null)}
        >
          <motion.div
            key={currentProfile.id}
            className="w-full h-full absolute inset-0"
            exit={{
              x: swipeDirection === 'LIKE' ? 500 : swipeDirection === 'PASS' ? -500 : 0,
              y: 40,
              opacity: 0,
              rotate: swipeDirection === 'LIKE' ? 18 : swipeDirection === 'PASS' ? -18 : 0,
              transition: { duration: 0.38, ease: 'easeOut' }
            }}
          >
            <ProfileCard
              profile={currentProfile}
              isFront={true}
              isSwiping={isSwiping}
              onSwipe={(action) => handleAction(action)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile-Only Action Buttons (Floating below the card as shown in mobile mockup!) */}
      <div className="sm:hidden mt-6 w-full flex justify-center">
        <SwipeButtons
          onPass={() => handleAction('PASS')}
          onLike={() => handleAction('LIKE')}
          disabled={isSwiping}
          size="large"
        />
      </div>

      {/* Desktop subtle gesture helper text */}
      <p className="hidden sm:block text-xs font-medium text-[#786B78] mt-4 tracking-wide">
        Drag card left to Pass, right to Like • Or use the action buttons
      </p>
    </div>
  );
}
