/**
 * @license
 * CareContinuum - Dashboard Home Screen (Screen 08 & States)
 * Implements wireframe screen 08, 11 (Household member filters),
 * Empty inventory state (Screen 31), and Box Offline state (Screen 33).
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { StatusChip } from '../common/StatusChip';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { Pill, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { getMedicineStatus } from '../../services/medicineService';
import { Medicine } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    state,
    expiredCount,
    expiringSoonCount,
    lowStockCount,
    todayDosesSummary,
    setCurrentScreen,
    setSelectedMedicine,
    setActiveTab,
    toggleBoxOnline
  } = useApp();

  const [activeMemberFilter, setActiveMemberFilter] = useState<'all' | string>('all');

  const isBoxOffline = !state.boxStatus.isOnline;
  const householdMembers = state.household?.members || [];

  // Filter medicines based on selected member pill
  const displayedMedicines = state.medicines.filter((med) => {
    if (activeMemberFilter === 'all') return true;
    return med.assignedMemberId === activeMemberFilter;
  });

  const getMemberName = (memberId: string) => {
    const member = householdMembers.find((m) => m.id === memberId);
    return member ? member.name.split(' ')[0] : 'All';
  };

  const handleMedicineClick = (med: Medicine) => {
    setSelectedMedicine(med);
    setCurrentScreen('12_medicine_details');
  };

  const handleDoseClick = () => {
    const targetLog = state.doseLogs.find(l => l.status === 'Upcoming') || state.doseLogs[0];
    if (targetLog) {
      setCurrentScreen('15_alerts');
      setActiveTab('alerts');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="08 / HOME" />

      <main className="px-5 pt-4 space-y-4">
        {/* Title & Household context */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your day at a glance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {state.household ? `${state.household.name} · ` : ''}Wednesday, 14 October
          </p>
        </div>

        {/* Household Member Filter Pills (Wireframe 11 / HOME) */}
        {state.household && householdMembers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveMemberFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeMemberFilter === 'all'
                  ? 'border-[#1E7B99] bg-[#EBF5F8] text-[#1E7B99]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Everyone
            </button>
            {householdMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMemberFilter(m.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeMemberFilter === m.id
                    ? 'border-[#1E7B99] bg-[#EBF5F8] text-[#1E7B99]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* 3 Status Counters Row: Expired, Expiring soon, Low stock */}
        <div className="grid grid-cols-3 gap-3">
          {/* Expired Counter */}
          <div className="bg-[#F3F7F8] border border-slate-200/60 rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-2xl font-bold text-rose-600">{expiredCount}</span>
            <span className="text-xs font-medium text-slate-600 mt-1">Expired</span>
          </div>

          {/* Expiring Soon Counter */}
          <div className="bg-[#F3F7F8] border border-slate-200/60 rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-2xl font-bold text-amber-600">{expiringSoonCount}</span>
            <span className="text-xs font-medium text-slate-600 mt-1">Expiring soon</span>
          </div>

          {/* Low Stock Counter */}
          <div className="bg-[#F3F7F8] border border-slate-200/60 rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-2xl font-bold text-amber-600">{lowStockCount}</span>
            <span className="text-xs font-medium text-slate-600 mt-1">Low stock</span>
          </div>
        </div>

        {/* Today's Doses Card (Normal vs Box Offline State) */}
        <div
          onClick={handleDoseClick}
          className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs cursor-pointer hover:border-[#1E7B99]/40 transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>Today&apos;s doses</span>
              <span className="text-slate-400">·</span>
              {isBoxOffline ? (
                <span className="text-amber-600 text-xs font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Box offline
                </span>
              ) : (
                <span className="text-[#1E7B99]">Next at {todayDosesSummary.nextTime}</span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <p className="text-xs text-slate-600">
            {todayDosesSummary.primaryMedicine} · {todayDosesSummary.taken} taken / {todayDosesSummary.upcoming} upcoming / {todayDosesSummary.missed} missed
          </p>

          {isBoxOffline && (
            <p className="text-[11px] text-slate-400">
              Last synced {state.boxStatus.lastSynced} · Stored inventory
            </p>
          )}

          <NotMedicalAdvice />
        </div>

        {/* Offline Reconnect Action Banner (if box is simulated offline) */}
        {isBoxOffline && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <span className="text-xs text-amber-800 font-medium">
              Physical medicine box is offline.
            </span>
            <button
              onClick={toggleBoxOnline}
              className="text-xs font-bold text-[#1E7B99] flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reconnect box
            </button>
          </div>
        )}

        {/* Medicines in your box Section Header */}
        <div className="pt-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Medicines in your box
          </h2>
          <span className="text-xs text-slate-400">
            {displayedMedicines.length} items
          </span>
        </div>

        {/* Medicine Items List OR Empty State (Screen 31) */}
        {displayedMedicines.length > 0 ? (
          <div className="space-y-3">
            {displayedMedicines.map((med) => {
              const status = getMedicineStatus(med);
              const assignedName = getMemberName(med.assignedMemberId);

              return (
                <div
                  key={med.id}
                  onClick={() => handleMedicineClick(med)}
                  className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs cursor-pointer hover:border-slate-300 transition-all flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900">
                      {med.name} {med.strength}
                    </div>
                    <div className="text-xs text-slate-500">
                      {med.purpose} · {med.expiryDate}
                    </div>
                    <div className="text-xs font-medium text-slate-600">
                      {med.quantityInStock} {med.quantityUnit} left
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusChip status={status} />
                    {state.household && med.assignedMemberId && (
                      <span className="text-[11px] font-medium text-slate-500">
                        For: {assignedName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State matching Wireframe Page 31 */
          <div className="my-6 p-8 bg-[#F3F7F8] rounded-3xl border border-slate-200/60 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#1E7B99] mb-3">
              <Pill className="w-8 h-8 -rotate-45" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">No medicines added yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Start with your first medicine. Scan a medicine using your paired box to begin tracking your inventory.
            </p>
            <NotMedicalAdvice className="mt-3" />
          </div>
        )}

        {/* Scan medicine pill button */}
        <div className="pt-2">
          {isBoxOffline ? (
            <PillButton
              variant="primary"
              onClick={toggleBoxOnline}
            >
              Reconnect box
            </PillButton>
          ) : (
            <PillButton
              variant="primary"
              onClick={() => {
                setCurrentScreen('10_scan_medicine');
                setActiveTab('medicines');
              }}
            >
              Scan medicine
            </PillButton>
          )}
        </div>
      </main>
    </div>
  );
};
