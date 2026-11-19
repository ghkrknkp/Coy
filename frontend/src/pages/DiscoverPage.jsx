import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import CardStack from '../components/CardStack.jsx';
import EmptyState from '../components/EmptyState.jsx';
import MatchModal from '../components/MatchModal.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import api from '../services/api.js';
import { Shield, AlertCircle, Sparkles } from 'lucide-react';

export default function DiscoverPage({ onMatchFound, onResetDemo, isResetting }) {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [error, setError] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  const isFetchingMore = useRef(false);
  const hasMoreProfiles = useRef(true);

  // Fetch initial feed
  const loadFeed = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsLoading(true);
        hasMoreProfiles.current = true;
      }
      setError(null);
      const res = await api.getFeed(10, 0);
      if (res.success) {
        setProfiles(res.data);
        if (res.data.length < 10) {
          hasMoreProfiles.current = false;
        }
      }
    } catch (err) {
      console.error('Failed to load feed:', err);
      setError('Unable to load profiles. Please ensure the backend is running on port 5001.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync match count
  const loadMatchCount = useCallback(async () => {
    try {
      const res = await api.getMatches();
      if (res.success) {
        setMatchCount(res.count);
        if (onMatchFound) onMatchFound(res.count);
      }
    } catch {
      // Ignore background match check failure
    }
  }, [onMatchFound]);

  useEffect(() => {
    loadFeed(true);
    loadMatchCount();
  }, [loadFeed, loadMatchCount]);

  // Handle swipe action
  const handleSwipe = async (profileId, action) => {
    if (isSwiping) return;
    setIsSwiping(true);

    // Optimistically remove card
    const remaining = profiles.slice(1);
    setProfiles(remaining);

    try {
      const res = await api.swipe(profileId, action);

      if (res.success && res.matched) {
        setCurrentMatch(res.match);
        setIsMatchModalOpen(true);
        setMatchCount((prev) => prev + 1);
        if (onMatchFound) onMatchFound(matchCount + 1);
      }

      // Pre-fetch next profiles if deck is low
      if (remaining.length <= 3 && hasMoreProfiles.current && !isFetchingMore.current) {
        isFetchingMore.current = true;
        api.getFeed(10, 0)
          .then((moreRes) => {
            if (moreRes.success && moreRes.data.length > 0) {
              setProfiles((current) => {
                const existingIds = new Set(current.map((p) => p.id));
                const filtered = moreRes.data.filter((p) => !existingIds.has(p.id));
                return [...current, ...filtered];
              });
            } else {
              hasMoreProfiles.current = false;
            }
          })
          .catch((err) => console.error('Prefetch error:', err))
          .finally(() => {
            isFetchingMore.current = false;
          });
      }
    } catch (err) {
      console.error('Swipe error:', err);
      if (err.status !== 409) {
        setError(err.message || 'Failed to record swipe.');
      }
    } finally {
      setTimeout(() => {
        setIsSwiping(false);
      }, 360);
    }
  };

  const handleReset = async () => {
    if (onResetDemo) {
      await onResetDemo();
      loadFeed(true);
      loadMatchCount();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col justify-between py-4 sm:py-8 px-4 sm:px-8 pb-24 lg:pb-8"
    >
      {/* Top Header Bar matching the Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#18111B] tracking-tight">
            Discover
          </h1>
          <p className="text-sm font-medium text-[#786B78] mt-1">
            Find people and see if the feeling is mutual.
          </p>
        </div>

        {/* Demo User Status Pill (Top Right on Desktop in Reference Image!) */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F3DCE8] shadow-sm self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          <span className="text-xs font-bold text-[#18111B]">Demo User</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-md mx-auto mb-6 w-full bg-[#FFF1F7] border border-[#F3DCE8] text-[#F04465] px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F04465] shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadFeed(true)}
            className="text-[#DB2777] underline font-bold ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Discover Content Area */}
      <div className="flex-1 flex items-center justify-center w-full min-h-[480px]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : profiles.length > 0 ? (
          <CardStack
            profiles={profiles}
            onSwipe={handleSwipe}
            isSwiping={isSwiping}
          />
        ) : (
          <EmptyState
            onResetDemo={handleReset}
            isResetting={isResetting}
            matchCount={matchCount}
          />
        )}
      </div>

      {/* Mutual Match Modal */}
      <MatchModal
        match={currentMatch}
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
      />
    </motion.div>
  );
}
