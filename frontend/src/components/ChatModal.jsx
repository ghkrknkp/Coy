import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Heart, MapPin } from 'lucide-react';
import api from '../services/api.js';

export default function ChatModal({ match, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const profile = match?.profile;
  const matchId = match?.matchId;

  // Auto-scroll to bottom of conversation
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen && matchId) {
      setIsLoading(true);
      api.getMessages(matchId)
        .then((res) => {
          if (res.success) {
            setMessages(res.messages || []);
          }
        })
        .catch((err) => {
          console.error('Failed to load messages:', err);
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => scrollToBottom('auto'), 100);
        });
    }
  }, [isOpen, matchId]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isBotTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const message = (textToSend || inputText).trim();
    if (!message || isBotTyping || !matchId) return;

    setInputText('');

    // Optimistically append user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      sender_id: 'demo-user-1',
      text: message,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsBotTyping(true);

    try {
      // Simulate realistic typing rhythm (850ms - 1100ms)
      const [res] = await Promise.all([
        api.sendMessage(matchId, message),
        new Promise((resolve) => setTimeout(resolve, 950))
      ]);

      if (res.success) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
          return [...filtered, res.userMessage, res.botMessage];
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Append fallback in-character reply if network has hiccups
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender_id: profile?.id,
          text: `Haha, I totally get what you mean! What else are you up to today? 😊`,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !match || !profile) return null;

  // Starters based on profile interests
  const starters = [
    `Hey ${profile.name}! Loved your profile ✨`,
    `What's your favorite spot in ${profile.location}? ☕`,
    profile.interests?.[0] ? `Tell me more about ${profile.interests[0]}! 📚` : `How has your day been so far?`
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#18111B]/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg h-[92vh] sm:h-[620px] bg-[#FFF9FC] rounded-3xl sm:rounded-4xl shadow-2xl border border-[#F3DCE8] flex flex-col overflow-hidden select-none"
        >
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-md border-b border-[#F3DCE8] px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Profile Avatar */}
              <div className="relative">
                <img
                  src={profile.image_url}
                  alt={profile.name}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-[#FCE7F3]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              {/* Name & Online Status */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#18111B]">
                    {profile.name}, {profile.age}
                  </h3>
                  <Heart className="w-3.5 h-3.5 fill-[#EC4899] text-[#EC4899]" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#786B78]">
                  <MapPin className="w-3 h-3 text-[#EC4899]" />
                  <span>{profile.location}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">
                    {isBotTyping ? 'Typing...' : 'Online now'}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#FFF1F7] border border-[#F3DCE8] text-[#786B78] hover:text-[#18111B] flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-10 h-10 rounded-full border-3 border-[#FCE7F3] border-t-[#EC4899] animate-spin mb-3" />
                <p className="text-xs font-semibold text-[#786B78]">Connecting to {profile.name}...</p>
              </div>
            ) : (
              <>
                {/* Intro Match Bubble */}
                <div className="text-center py-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-[#F3DCE8] rounded-full text-[10px] font-semibold text-[#786B78]">
                    <Sparkles className="w-3 h-3 text-[#EC4899]" />
                    <span>You and {profile.name} matched on Coy</span>
                  </span>
                </div>

                {messages.map((msg) => {
                  const isUser = msg.sender_id === 'demo-user-1';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Match Avatar for received messages */}
                      {!isUser && (
                        <img
                          src={profile.image_url}
                          alt={profile.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 ring-1 ring-[#FCE7F3]"
                        />
                      )}

                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-gradient-to-tr from-[#EC4899] to-[#DB2777] text-white rounded-br-xs font-medium'
                            : 'bg-white text-[#18111B] border border-[#F3DCE8] rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing Indicator */}
                {isBotTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <img
                      src={profile.image_url}
                      alt={profile.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 ring-1 ring-[#FCE7F3]"
                    />
                    <div className="bg-white border border-[#F3DCE8] px-3.5 py-2.5 rounded-2xl rounded-bl-xs shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick Conversation Starters Chips */}
          <div className="px-4 py-2 bg-white/70 border-t border-[#F3DCE8]/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {starters.map((starter, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(starter)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-[#FFF1F7] hover:bg-[#FCE7F3] border border-[#F3DCE8] text-[11px] font-semibold text-[#DB2777] transition-all shrink-0"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#F3DCE8] flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${profile.name}...`}
              disabled={isBotTyping}
              className="flex-1 px-4 py-2.5 rounded-full bg-[#FFF9FC] border border-[#F3DCE8] text-xs sm:text-sm text-[#18111B] placeholder-[#786B78]/70 focus:outline-none focus:border-[#EC4899] transition-colors disabled:opacity-60"
            />

            <motion.button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isBotTyping}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#DB2777] text-white flex items-center justify-center shadow-btn-like disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4 fill-white ml-0.5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
