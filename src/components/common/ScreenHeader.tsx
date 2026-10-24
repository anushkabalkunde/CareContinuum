/**
 * @license
 * CareContinuum - ScreenHeader Component
 * Matches wireframe headers: "CareContinuum" with "NN / SECTION" subtitle,
 * Netflix-style family profile badge, and Smart Box status indicator.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, WifiOff, Users, BookOpen } from 'lucide-react';

interface ScreenHeaderProps {
  sectionTag: string; // e.g. "01 / SETUP", "08 / HOME", "09 / MEDICINES"
  showNavControls?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ sectionTag, showNavControls = true }) => {
  const {
    state,
    activeMember,
    setIsNetflixProfileModalOpen,
    setIsDocsModalOpen,
    setCurrentScreen
  } = useApp();

  const isBoxOnline = state.boxStatus.isPaired && state.boxStatus.isOnline;

  return (
    <header className="px-4 pt-3 pb-2 bg-white/95 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[#1E7B99] font-bold text-base tracking-tight flex items-center gap-1.5">
            CareContinuum
          </div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {sectionTag}
          </div>
        </div>

        {showNavControls && (
          <div className="flex items-center gap-2">
            {/* Docs & Database storage info button */}
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Documentation, Architecture & Database Storage"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Smart Box connection status indicator pill */}
            <button
              onClick={() => setCurrentScreen('18_medicine_box')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                isBoxOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to view Medicine Box status"
            >
              {isBoxOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>Box Paired</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span>Box Offline</span>
                </>
              )}
            </button>

            {/* Netflix-style joint family profile switcher pill */}
            {state.household && (
              <button
                onClick={() => setIsNetflixProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                title="Switch Family Profile (Netflix style)"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white font-bold"
                  style={{ backgroundColor: activeMember ? activeMember.avatarColor : '#1E7B99' }}
                >
                  {activeMember ? activeMember.name[0] : 'All'}
                </div>
                <span className="max-w-[70px] truncate">
                  {activeMember ? activeMember.name.split(' ')[0] : 'Everyone'}
                </span>
                <Users className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
