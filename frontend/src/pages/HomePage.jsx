import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Sparkles, Heart, Shield, Lock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-coy-50 border border-coy-100 rounded-full text-xs font-semibold text-coy-700 mb-6">
        <Sparkles className="w-3.5 h-3.5 text-coy-600" />
        <span>Coy SDE Intern Assignment (Part B)</span>
      </div>

      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-coy-600 to-coy-400 text-white flex items-center justify-center shadow-button mb-6">
        <Heart className="w-10 h-10 fill-white" />
      </div>

      <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
        Welcome to Coy
      </h1>

      <p className="mt-3 text-base text-neutral-600 leading-relaxed max-w-md">
        The privacy-first dating experience where curiosity meets complete peace of mind.
      </p>

      {/* Assignment note card */}
      <div className="mt-8 p-5 bg-white rounded-3xl border border-neutral-200 text-left shadow-sm w-full">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
          <Lock className="w-4 h-4 text-coy-500" />
          <span>Core Privacy Rule</span>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          As per the assignment requirements, the <strong>Home</strong> tab is kept as a minimal placeholder. Head over to the <strong>Discover</strong> tab to explore the full interactive swipe discovery deck and mutual matching engine!
        </p>

        <div className="mt-5">
          <NavLink
            to="/discover"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-coy-600 to-coy-500 text-white font-bold text-sm shadow-button hover:from-coy-500 hover:to-coy-400 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Open Discover Tab</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

