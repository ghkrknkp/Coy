import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Heart, User, RotateCcw } from 'lucide-react';

export default function Navbar({ matchCount = 0, onResetDemo, isResetting = false }) {
  const location = useLocation();

  const navItems = [
    { name: 'Discover', path: '/discover', icon: Compass, label: 'Discover' },
    { name: 'Matches', path: '/matches', icon: Heart, label: 'Matches', badge: matchCount },
    { name: 'Profile', path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Top Header (Matches bottom mockup in reference image!) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F3DCE8] px-4 h-14 flex items-center justify-between select-none">
        {/* Reset Action */}
        <button
          type="button"
          onClick={onResetDemo}
          disabled={isResetting}
          aria-label="Reset deck"
          className="p-2 rounded-full text-[#786B78] hover:text-[#EC4899] transition-colors"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-[#EC4899]' : ''}`} />
        </button>

        {/* Centered Coy Logo */}
        <NavLink to="/discover" className="flex items-center gap-1.5">
          <Heart className="w-5 h-5 fill-[#EC4899] stroke-[#EC4899]" />
          <span className="text-xl font-black tracking-tight text-[#EC4899]">
            Coy
          </span>
        </NavLink>

        {/* Top Right Avatar */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
            alt="You"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FCE7F3]"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Matches bottom mockup in reference image!) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F3DCE8] px-6 py-2 flex items-center justify-around shadow-lg select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/discover' && location.pathname === '/');
          return (
            <NavLink
              key={item.name}
              to={item.path === '/profile' ? '/matches' : item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-[#DB2777] font-bold'
                  : 'text-[#786B78] font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#EC4899] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px]">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full -mt-0.5" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
