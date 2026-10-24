/**
 * @license
 * CareContinuum - Household Management Screen (Screen 17 & 28 / HOME)
 * Joint family account management, member roles, invite code sharing,
 * pending join request approvals, and dependent creation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { StatusChip } from '../common/StatusChip';
import { ChevronLeft, Copy, Check, Users, Shield, User, Heart, Share2, Plus } from 'lucide-react';

export const HouseholdManagementScreen: React.FC = () => {
  const {
    state,
    setCurrentScreen,
    approveJoinRequest,
    rejectJoinRequest,
    addDependentWithoutLogin,
    setIsNetflixProfileModalOpen
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isAddDependentOpen, setIsAddDependentOpen] = useState(false);
  const [dependentName, setDependentName] = useState('');
  const [dependentNotes, setDependentNotes] = useState('');

  const household = state.household;
  const members = household?.members || [];
  const pendingRequests = state.joinRequests.filter((r) => r.status === 'pending');

  const handleCopyCode = () => {
    if (household?.inviteCode) {
      navigator.clipboard?.writeText(household.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dependentName.trim()) return;
    addDependentWithoutLogin(dependentName.trim(), dependentNotes.trim());
    setDependentName('');
    setDependentNotes('');
    setIsAddDependentOpen(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="w-4 h-4 text-[#1E7B99]" />;
      case 'Dependent':
        return <Heart className="w-4 h-4 text-amber-500" />;
      default:
        return <User className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="17 / HOME" />

      <main className="px-5 pt-3 space-y-4">
        {/* Back navigation */}
        <button
          onClick={() => setCurrentScreen('08_home')}
          className="flex items-center gap-1 text-xs font-semibold text-[#1E7B99] hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your household
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {household?.name || 'Demo household'} · Dummy members only
          </p>
        </div>

        {/* Members List (Wireframe 28) */}
        <div className="space-y-3 pt-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.name[0]}
                  </div>
                  <span>{member.name} · {member.role}</span>
                </div>
                {getRoleIcon(member.role)}
              </div>

              <p className="text-xs text-slate-500 pl-7">
                {member.role === 'Admin'
                  ? 'Manages your household and join requests'
                  : member.role === 'Dependent'
                  ? member.notes || 'Dependent · No login required'
                  : 'Shared medicine box access'}
              </p>
            </div>
          ))}
        </div>

        {/* Pending Join Requests (Wireframe 28) */}
        {pendingRequests.length > 0 && (
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-900">
                    Pending join request
                  </div>
                  <StatusChip status="Awaiting approval" />
                </div>

                <p className="text-xs text-slate-600">
                  <strong>{req.userName}</strong> wants to join your group.
                </p>

                <div className="flex gap-2 pt-1">
                  <PillButton
                    variant="primary"
                    size="sm"
                    onClick={() => approveJoinRequest(req.id)}
                  >
                    Approve
                  </PillButton>
                  <PillButton
                    variant="secondary"
                    size="sm"
                    onClick={() => rejectJoinRequest(req.id)}
                  >
                    Reject
                  </PillButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Household Invite Code Card */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-slate-900">
                Household invite code
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Share to invite a family member
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Copy code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-[#F3F7F8] rounded-xl flex items-center justify-between">
            <span className="font-mono font-bold text-lg text-[#1E7B99] tracking-wider">
              {household?.inviteCode || 'CC-4826'}
            </span>
            <span className="text-[11px] text-slate-400">
              {copiedCode ? 'Copied!' : 'Tap icon to copy'}
            </span>
          </div>
        </div>

        {/* Quick Profile Switcher Shortcut */}
        <div className="p-3 bg-[#EBF5F8] border border-[#BDE0EA] rounded-2xl flex items-center justify-between">
          <div className="text-xs text-[#155E75]">
            <span className="font-bold">Netflix Profile Mode:</span> Switch active family member
          </div>
          <button
            onClick={() => setIsNetflixProfileModalOpen(true)}
            className="text-xs font-bold text-[#1E7B99] underline"
          >
            Switch Profile
          </button>
        </div>

        {/* Add Dependent without login Button */}
        <div className="pt-2">
          <PillButton
            variant="primary"
            onClick={() => setIsAddDependentOpen(true)}
            className="flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add dependent without login</span>
          </PillButton>
        </div>

        {/* Add Dependent Modal */}
        {isAddDependentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <form
              onSubmit={handleAddDependent}
              className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl border border-slate-100"
            >
              <h3 className="font-bold text-base text-slate-900">
                Add Dependent Profile
              </h3>
              <p className="text-xs text-slate-500">
                For family members (children, seniors, grandparents) without a smartphone or email.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Dependent Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Riley Demo, Grandma May"
                  value={dependentName}
                  onChange={(e) => setDependentName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dependent · Needs morning assistance"
                  value={dependentNotes}
                  onChange={(e) => setDependentNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <PillButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddDependentOpen(false)}
                >
                  Cancel
                </PillButton>
                <PillButton type="submit" variant="primary" size="sm">
                  Add Member
                </PillButton>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
