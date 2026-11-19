import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Heart, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';

export default function Sidebar({ matchCount = 0, onResetDemo, isResetting = false }) {
  const location = useLocation();

  const navItems = [
    { name: 'Discover', path: '/discover', icon: Compass, label: 'Discover' },
    { name: 'Matches', path: '/matches', icon: Heart, label: 'Matches', badge: matchCount },
  ];

  return (
    <aside className="hidden lg:flex w-64 xl:w-72 flex-col justify-between h-screen sticky top-0 bg-white border-r border-[#F3DCE8] p-6 z-30 select-none">
      {/* Top Brand Logo */}
      <div>
        <NavLink to="/discover" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#F472B6] flex items-center justify-center text-white shadow-btn-like group-hover:scale-105 transition-transform duration-200">
            <Heart className="w-5 h-5 fill-white stroke-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#EC4899]">
            Coy
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FFF1F7] text-[#DB2777] border border-[#F3DCE8] shadow-sm'
                    : 'text-[#786B78] hover:bg-[#FFF9FC] hover:text-[#18111B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EC4899] text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Demo User Card & Reset Button */}
      <div className="pt-4 border-t border-[#F3DCE8] space-y-3">
        {/* Reset Demo Action */}
        {onResetDemo && (
          <button
            type="button"
            onClick={onResetDemo}
            disabled={isResetting}
            title="Reset demo swipes and state"
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-[#786B78] hover:text-[#EC4899] hover:bg-[#FFF1F7] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-[#EC4899]' : ''}`} />
            <span>Reset Demo Deck</span>
          </button>
        )}

        {/* Demo User Identity */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9FC] border border-[#F3DCE8]/80">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=150&q=80"
                alt="You"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FCE7F3]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#18111B] leading-tight">You</span>
              <span className="text-[11px] text-[#786B78] leading-tight">Demo User</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#786B78]" />
        </div>
      </div>
    </aside>
  );
}

