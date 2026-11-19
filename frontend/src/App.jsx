import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import MatchesPage from './pages/MatchesPage.jsx';
import ToastNotification from './components/ToastNotification.jsx';
import api from './services/api.js';

export default function App() {
  const [matchCount, setMatchCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync match count on initial load
  useEffect(() => {
    async function checkMatches() {
      try {
        const res = await api.getMatches();
        if (res.success) {
          setMatchCount(res.count);
        }
      } catch {
        // Silent on initial load
      }
    }
    checkMatches();
  }, []);

  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      const res = await api.resetDemo();
      if (res.success) {
        setMatchCount(0);
        setToastMessage('Demo deck reset! 32 fresh profiles ready.');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FFF9FC] bg-ambient-hearts flex flex-col lg:flex-row font-sans text-[#18111B] antialiased selection:bg-[#FCE7F3] selection:text-[#DB2777]">
        {/* Desktop Sidebar (visible on lg+) */}
        <Sidebar
          matchCount={matchCount}
          onResetDemo={handleResetDemo}
          isResetting={isResetting}
        />

        {/* Mobile Top Header & Bottom Bar (visible below lg) */}
        <Navbar
          matchCount={matchCount}
          onResetDemo={handleResetDemo}
          isResetting={isResetting}
        />

        {/* Global Toast */}
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen flex justify-center overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/discover" replace />} />
            <Route
              path="/discover"
              element={
                <DiscoverPage
                  onMatchFound={(count) => setMatchCount(count)}
                  onResetDemo={handleResetDemo}
                  isResetting={isResetting}
                />
              }
            />
            <Route
              path="/matches"
              element={<MatchesPage onMatchCountUpdate={(count) => setMatchCount(count)} />}
            />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
