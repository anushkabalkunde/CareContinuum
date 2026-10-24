/**
 * @license
 * CareContinuum - Routines Screen (Screen 13 & 20, 21 / ROUTINES)
 * Short-term courses, Chronic daily routines, member filtering, and progress tracking.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { Clock, Calendar, ChevronRight, Activity } from 'lucide-react';

export const RoutinesScreen: React.FC = () => {
  const {
    state,
    setCurrentScreen,
    setActiveTab
  } = useApp();

  const [activeTabType, setActiveTabType] = useState<'all' | 'short-term' | 'chronic'>('short-term');
  const [selectedMemberId, setSelectedMemberId] = useState<'all' | string>('all');
  const [isWhoIsThisForOpen, setIsWhoIsThisForOpen] = useState(false);

  const members = state.household?.members || [];

  const getMemberName = (id: string) => {
    const m = members.find((x) => x.id === id);
    return m ? m.name.split(' ')[0] : 'Alex';
  };

  // Filter routines by member and type
  const filteredRoutines = state.routines.filter((r) => {
    if (selectedMemberId !== 'all' && r.memberId !== selectedMemberId) return false;
    if (activeTabType === 'short-term' && r.type !== 'short-term') return false;
    if (activeTabType === 'chronic' && r.type !== 'chronic') return false;
    return true;
  });

  const shortTermRoutines = filteredRoutines.filter((r) => r.type === 'short-term');
  const chronicRoutines = filteredRoutines.filter((r) => r.type === 'chronic');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="13 / ROUTINES" />

      <main className="px-5 pt-3 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {selectedMemberId !== 'all' ? `${getMemberName(selectedMemberId)}'s routines` : 'Your routines'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Short courses and daily care, clearly organised.
          </p>
        </div>

        {/* Member selector tag (Wireframe 21 / ROUTINES: "For: Alex") */}
        {state.household && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsWhoIsThisForOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF5F8] text-[#1E7B99] border border-[#BDE0EA] hover:bg-[#D8EDF3] transition-colors"
            >
              <span>For: {selectedMemberId === 'all' ? 'Everyone' : getMemberName(selectedMemberId)}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick link to adherence history */}
            <button
              onClick={() => setCurrentScreen('16_adherence_history')}
              className="text-xs text-[#1E7B99] font-bold flex items-center gap-1 hover:underline"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Adherence history</span>
            </button>
          </div>
        )}

        {/* Short-term | Chronic Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2 text-sm font-semibold">
          <button
            onClick={() => setActiveTabType('short-term')}
            className={`pb-1 transition-colors ${
              activeTabType === 'short-term'
                ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Short-term
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setActiveTabType('chronic')}
            className={`pb-1 transition-colors ${
              activeTabType === 'chronic'
                ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Chronic
          </button>
        </div>

        {/* Short-term Courses Section */}
        {activeTabType === 'short-term' && (
          <div className="space-y-3">
            {shortTermRoutines.length > 0 ? (
              shortTermRoutines.map((routine) => {
                const totalDays = routine.durationDays || 5;
                const currentDay = routine.currentDay || 2;
                const progressPct = Math.min(100, Math.round((currentDay / totalDays) * 100));

                return (
                  <div
                    key={routine.id}
                    className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3"
                  >
                    <div>
                      <div className="font-bold text-base text-slate-900">
                        {routine.title} · Day {currentDay} of {totalDays}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {routine.medicineName} {routine.medicineStrength} · Next at {routine.scheduleTimes[0] || '12:00 PM'}
                      </div>
                      <NotMedicalAdvice className="mt-1" />
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Day {currentDay} of {totalDays} · Sample progress
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1E7B99] rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No short-term courses active.
              </div>
            )}
          </div>
        )}

        {/* Chronic Routines Section */}
        {activeTabType === 'chronic' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Chronic</h2>
            {chronicRoutines.length > 0 ? (
              chronicRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1"
                >
                  <div className="font-bold text-base text-slate-900">
                    {routine.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    Daily {routine.scheduleTimes[0] || '7:00 AM'} · Ongoing
                  </div>
                  <div className="text-xs text-slate-400">
                    {routine.medicineName} {routine.medicineStrength} · {routine.doseAmount} {routine.doseUnit}
                  </div>
                  <NotMedicalAdvice className="pt-1" />
                </div>
              ))
            ) : (
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1">
                <div className="font-bold text-base text-slate-900">Thyroid</div>
                <div className="text-xs text-slate-500">Daily 7:00 AM · Ongoing</div>
                <div className="text-xs text-slate-400">Sample routine placeholder</div>
                <NotMedicalAdvice className="pt-1" />
              </div>
            )}
          </div>
        )}

        <NotMedicalAdvice />

        {/* New Routine Pill Button */}
        <div className="pt-2">
          <PillButton
            variant="primary"
            onClick={() => setCurrentScreen('14_new_routine_wizard')}
          >
            New routine
          </PillButton>
        </div>

        {/* Wireframe Screen 20: "Who is this for?" Member Selector Modal */}
        {isWhoIsThisForOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-slate-100">
              <div>
                <h3 className="font-bold text-xl text-slate-900">
                  Who is this for?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a household member to see routines.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Everyone option */}
                <div
                  onClick={() => {
                    setSelectedMemberId('all');
                    setIsWhoIsThisForOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-colors ${
                    selectedMemberId === 'all'
                      ? 'border-[#1E7B99] bg-[#EBF5F8]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg text-[#1E7B99]">
                    {selectedMemberId === 'all' ? '◉' : '○'}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Everyone</div>
                    <div className="text-xs text-slate-500">All household routines</div>
                  </div>
                </div>

                {/* Individual Members */}
                {members.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMemberId(m.id);
                      setIsWhoIsThisForOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedMemberId === m.id
                        ? 'border-[#1E7B99] bg-[#EBF5F8]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg text-[#1E7B99]">
                      {selectedMemberId === m.id ? '◉' : '○'}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{m.name}</div>
                      <div className="text-xs text-slate-500">
                        {m.role} · {state.routines.filter((r) => r.memberId === m.id).length} routines
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <PillButton
                variant="primary"
                onClick={() => setIsWhoIsThisForOpen(false)}
              >
                Continue
              </PillButton>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
