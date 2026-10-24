/**
 * @license
 * CareContinuum - Netflix-Style Joint Account Profile Switcher
 * Provides multi-profile family access with joint medicine box inventory,
 * individual routine views, and dependent management without requiring separate logins.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Shield, User, Heart, X, Check, Settings } from 'lucide-react';
import { PillButton } from './PillButton';

export const NetflixProfileModal: React.FC = () => {
  const {
    state,
    isNetflixProfileModalOpen,
    setIsNetflixProfileModalOpen,
    switchProfile,
    addDependentWithoutLogin,
    setCurrentScreen
  } = useApp();

  const [isAddingDependent, setIsAddingDependent] = useState(false);
  const [dependentName, setDependentName] = useState('');
  const [dependentNotes, setDependentNotes] = useState('');

  if (!isNetflixProfileModalOpen) return null;

  const currentActiveId = state.user?.activeProfileId || 'all';
  const members = state.household?.members || [];

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dependentName.trim()) return;
    addDependentWithoutLogin(dependentName.trim(), dependentNotes.trim());
    setDependentName('');
    setDependentNotes('');
    setIsAddingDependent(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="w-3.5 h-3.5" />;
      case 'Dependent':
        return <Heart className="w-3.5 h-3.5" />;
      default:
        return <User className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#1E7B99] uppercase tracking-wider">
              Joint Family Account
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Who is caring?
            </h2>
          </div>
          <button
            onClick={() => {
              setIsNetflixProfileModalOpen(false);
              setIsAddingDependent(false);
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-500">
            Switch profile like Netflix. Medicines and routines can be filtered per person, while sharing one physical medicine box.
          </p>

          {!isAddingDependent ? (
            <>
              {/* Profiles Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Joint Household View (Everyone) */}
                <button
                  onClick={() => switchProfile('all')}
                  className={`relative p-3.5 rounded-2xl flex flex-col items-center text-center transition-all border ${
                    currentActiveId === 'all'
                      ? 'border-[#1E7B99] bg-[#EBF5F8] shadow-xs'
                      : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80'
                  }`}
                >
                  {currentActiveId === 'all' && (
                    <span className="absolute top-2 right-2 bg-[#1E7B99] text-white p-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E7B99] to-[#2EA3C7] text-white flex items-center justify-center mb-2 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-sm text-slate-900">Everyone</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Joint Household</div>
                </button>

                {/* Individual Members */}
                {members.map((member) => {
                  const isSelected = currentActiveId === member.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => switchProfile(member.id)}
                      className={`relative p-3.5 rounded-2xl flex flex-col items-center text-center transition-all border ${
                        isSelected
                          ? 'border-[#1E7B99] bg-[#EBF5F8] shadow-xs'
                          : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 bg-[#1E7B99] text-white p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                      <div
                        className="w-12 h-12 rounded-2xl text-white flex items-center justify-center mb-2 shadow-sm text-lg font-bold"
                        style={{ backgroundColor: member.avatarColor }}
                      >
                        {member.name[0]}
                      </div>
                      <div className="font-semibold text-sm text-slate-900 truncate max-w-full">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        {getRoleIcon(member.role)}
                        <span>{member.role}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add Dependent button */}
              <button
                onClick={() => setIsAddingDependent(true)}
                className="w-full py-3 px-4 rounded-2xl border border-dashed border-[#1E7B99]/60 bg-[#F3F7F8] hover:bg-[#EBF5F8] text-[#1E7B99] text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dependent (Child / Senior - No Login)</span>
              </button>

              {/* Manage Household link */}
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">Invite Code: <strong>{state.household?.inviteCode || 'CC-4826'}</strong></span>
                <button
                  onClick={() => {
                    setIsNetflixProfileModalOpen(false);
                    setCurrentScreen('17_household');
                  }}
                  className="text-[#1E7B99] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage Household
                </button>
              </div>
            </>
          ) : (
            /* Add Dependent Inline Form */
            <form onSubmit={handleAddDependent} className="space-y-3">
              <div className="bg-[#EBF5F8] p-3 rounded-xl text-xs text-[#155E75]">
                Dependents don&apos;t need their own phone or email. Family members can log their doses and monitor routines on their behalf.
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dependent Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandma Rose, Baby Liam"
                  value={dependentName}
                  onChange={(e) => setDependentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E7B99]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Care Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Needs assistance with morning syrup"
                  value={dependentNotes}
                  onChange={(e) => setDependentNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E7B99]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <PillButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddingDependent(false)}
                >
                  Back
                </PillButton>
                <PillButton type="submit" variant="primary" size="sm">
                  Save Profile
                </PillButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
