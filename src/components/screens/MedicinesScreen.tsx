/**
 * @license
 * CareContinuum - Medicines Screen (Screen 09 / MEDICINES)
 * Search stock, filter by status (All, Expiring, Expired, Low stock) and household member
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { StatusChip } from '../common/StatusChip';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { Search } from 'lucide-react';
import { getMedicineStatus } from '../../services/medicineService';
import { Medicine } from '../../types';

export const MedicinesScreen: React.FC = () => {
  const {
    state,
    setCurrentScreen,
    setSelectedMedicine,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Expiring' | 'Expired' | 'Low stock'>('All');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<'all' | string>('all');

  const householdMembers = state.household?.members || [];

  const getMemberName = (memberId: string) => {
    const member = householdMembers.find(m => m.id === memberId);
    return member ? member.name.split(' ')[0] : 'All';
  };

  // Filter medicines by search query, status chip, and member
  const filteredMedicines = state.medicines.filter((med) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = med.name.toLowerCase().includes(q);
      const matchPurpose = med.purpose.toLowerCase().includes(q);
      const matchStrength = med.strength.toLowerCase().includes(q);
      if (!matchName && !matchPurpose && !matchStrength) return false;
    }

    // 2. Status Filter
    const status = getMedicineStatus(med);
    if (selectedStatusFilter === 'Expiring' && status !== 'Expiring soon') return false;
    if (selectedStatusFilter === 'Expired' && status !== 'Expired') return false;
    if (selectedStatusFilter === 'Low stock' && status !== 'Low stock') return false;

    // 3. Member Filter
    if (selectedMemberFilter !== 'all' && med.assignedMemberId !== selectedMemberFilter) {
      return false;
    }

    return true;
  });

  const handleSelectMedicine = (med: Medicine) => {
    setSelectedMedicine(med);
    setCurrentScreen('12_medicine_details');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="09 / MEDICINES" />

      <main className="px-5 pt-4 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your medicines
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search stock and check what needs attention.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 ml-1">
            Search medicines
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by medicine name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-2xl py-3 px-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E7B99] shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5" />
          </div>
        </div>

        {/* Status Filter Chips: All | Expiring | Expired | Low stock */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Expiring', 'Expired', 'Low stock'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedStatusFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedStatusFilter === filter
                  ? 'border-[#1E7B99] bg-[#EBF5F8] text-[#1E7B99]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Household Member Filter Chips (Wireframe 13 / MEDICINES) */}
        {state.household && householdMembers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedMemberFilter('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedMemberFilter === 'all'
                  ? 'border-[#1E7B99] bg-[#EBF5F8] text-[#1E7B99]'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Everyone
            </button>
            {householdMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMemberFilter(m.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  selectedMemberFilter === m.id
                    ? 'border-[#1E7B99] bg-[#EBF5F8] text-[#1E7B99]'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Medicines List */}
        <div className="space-y-3 pt-1">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((med) => {
              const status = getMedicineStatus(med);
              const assignedName = getMemberName(med.assignedMemberId);

              return (
                <div
                  key={med.id}
                  onClick={() => handleSelectMedicine(med)}
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
            })
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No medicines match your filter.
            </div>
          )}
        </div>

        <NotMedicalAdvice />

        {/* Scan medicine pill button */}
        <div className="pt-2">
          <PillButton
            variant="primary"
            onClick={() => {
              setCurrentScreen('10_scan_medicine');
              setActiveTab('medicines');
            }}
          >
            Scan medicine
          </PillButton>
        </div>
      </main>
    </div>
  );
};
