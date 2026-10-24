/**
 * @license
 * CareContinuum - Android Frame Container & Viewport Controller
 * Emulates authentic Android smartphone shell with status bar (9:41, WiFi, 5G, Battery),
 * camera punch-hole, bottom gesture pill, and desktop framing options.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2, BookOpen, Users } from 'lucide-react';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isPhoneFrameMode,
    setIsPhoneFrameMode,
    setIsDocsModalOpen,
    setIsNetflixProfileModalOpen,
    state
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col items-center justify-center p-0 sm:py-6 selection:bg-[#1E7B99] selection:text-white">
      {/* Top Floating Applet Toolbar for Desktop / Reviewers */}
      <div className="w-full max-w-md mb-2 px-3 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300 font-semibold">CareContinuum Android Preview</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Documentation modal button */}
          <button
            onClick={() => setIsDocsModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
            title="Database storage & APK Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2EA3C7]" />
            <span className="hidden sm:inline">Docs & DB</span>
          </button>

          {/* Family Profiles switcher button */}
          {state.household && (
            <button
              onClick={() => setIsNetflixProfileModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
              title="Netflix Profile Switcher"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Profiles</span>
            </button>
          )}

          {/* Frame Toggle button */}
          <button
            onClick={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
            title={isPhoneFrameMode ? 'Switch to Fullscreen' : 'Switch to Phone Frame'}
          >
            {isPhoneFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container: Android Device Shell or Fullscreen */}
      <div
        className={`w-full transition-all duration-300 relative bg-white overflow-hidden flex flex-col ${
          isPhoneFrameMode
            ? 'max-w-[412px] h-[890px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl sm:ring-1 sm:ring-slate-700/50'
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Android Native Status Bar (9:41, WiFi, Signal, Battery, Camera Punch-hole) */}
        <div className="w-full bg-white px-6 pt-2 pb-1 flex items-center justify-between text-slate-900 select-none z-30 sticky top-0 border-b border-slate-50">
          <span className="text-xs font-bold tracking-tight">9:41</span>

          {/* Center Punch Hole Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner" />

          {/* Right Status Icons */}
          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Android Native Bottom Gesture Pill */}
        <div className="w-full bg-white/90 backdrop-blur-xs py-1.5 flex items-center justify-center pointer-events-none z-30">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
