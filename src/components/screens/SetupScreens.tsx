/**
 * @license
 * CareContinuum - Onboarding and Authentication Setup Screens (01 to 07)
 * Implements wireframe screens 01, 02, 03, 04, 05, 06, 07.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { InfoCard } from '../common/InfoCard';
import { StatusChip } from '../common/StatusChip';
import { Pill, Box, Bluetooth, Check, Shield, Users } from 'lucide-react';

/* =========================================================================
   Screen 01: Welcome / Setup Intro
   ========================================================================= */
export const SetupWelcome: React.FC = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="01 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Care, in one place.
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your smart medicine box companion.
          </p>

          {/* Central Illustrated Box Container */}
          <div className="my-8 p-10 bg-[#F3F7F8] rounded-3xl border border-slate-200/60 flex flex-col items-center justify-center">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-[#1E7B99]">
                <Pill className="w-8 h-8 -rotate-45" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-[#1E7B99]">
                <Box className="w-8 h-8" />
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">
              CareContinuum
            </span>
          </div>

          <InfoCard variant="soft" className="space-y-1">
            <h3 className="font-semibold text-sm text-slate-800">
              A little clarity, every day
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Keep track of medicines, expiry dates and daily routines — for you or your household.
            </p>
          </InfoCard>
        </div>

        <div className="space-y-3 pt-6">
          <PillButton
            variant="primary"
            onClick={() => setCurrentScreen('02_signup')}
          >
            Sign up
          </PillButton>
          <PillButton
            variant="secondary"
            onClick={() => setCurrentScreen('03_signin')}
          >
            Sign in
          </PillButton>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 02: Create Account
   ========================================================================= */
export const SetupSignUp: React.FC = () => {
  const { signUp, setCurrentScreen } = useApp();
  const [name, setName] = useState('Alex Demo');
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(name, email);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="02 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Start with a few simple details.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99] focus-within:ring-1 focus-within:ring-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99] focus-within:ring-1 focus-within:ring-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Email or phone</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99] focus-within:ring-1 focus-within:ring-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <p className="text-xs text-slate-400 pt-1">
              Dummy details for this wireframe only.
            </p>

            <div className="pt-6">
              <PillButton type="submit" variant="primary">
                Sign up
              </PillButton>
            </div>
          </form>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentScreen('03_signin')}
            className="text-xs text-[#1E7B99] font-semibold hover:underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 03: Sign In
   ========================================================================= */
export const SetupSignIn: React.FC = () => {
  const { signIn, setCurrentScreen } = useApp();
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="03 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Sign in to your CareContinuum account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Email or phone</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => alert('Password reset link sent to ' + email)}
                className="text-xs text-[#1E7B99] font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-6">
              <PillButton type="submit" variant="primary">
                Sign in
              </PillButton>
            </div>
          </form>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentScreen('02_signup')}
            className="text-xs text-[#1E7B99] font-semibold hover:underline"
          >
            Don&apos;t have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 04: Who are you caring for?
   ========================================================================= */
export const SetupHouseholdChoice: React.FC = () => {
  const { setCareMode } = useApp();
  const [selectedMode, setSelectedMode] = useState<'individual' | 'household'>('household');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="04 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Who are you caring for?
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Choose how you&apos;ll use your medicine box.
          </p>

          <div className="mt-8 space-y-4">
            {/* Individual option */}
            <div
              onClick={() => setSelectedMode('individual')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedMode === 'individual'
                  ? 'border-[#1E7B99] bg-[#EBF5F8]/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#1E7B99]">
                  {selectedMode === 'individual' ? '◉' : '○'}
                </span>
                <span className="font-bold text-base text-slate-900">
                  Just me · Individual
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 pl-6 leading-relaxed">
                Manage your own medicines and routines. Skip group setup and go straight to pairing your box.
              </p>
            </div>

            {/* Household option */}
            <div
              onClick={() => setSelectedMode('household')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedMode === 'household'
                  ? 'border-[#1E7B99] bg-[#EBF5F8]/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#1E7B99]">
                  {selectedMode === 'household' ? '◉' : '○'}
                </span>
                <span className="font-bold text-base text-slate-900">
                  My household · Household
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 pl-6 leading-relaxed">
                Share one box, assign medicines to members and manage routines together.
              </p>
            </div>

            <div className="text-xs text-slate-400 pl-1 pt-1">
              {selectedMode === 'household' ? 'Household selected' : 'Individual selected'}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <PillButton
            variant="primary"
            onClick={() => setCareMode(selectedMode)}
          >
            Continue
          </PillButton>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 05: Setup Household (Create New Group | Join Existing)
   ========================================================================= */
export const SetupCreateHousehold: React.FC = () => {
  const { createHousehold, setCurrentScreen } = useApp();
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [groupName, setGroupName] = useState('Demo household');
  const inviteCode = 'CC-4826';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHousehold(groupName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="05 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Set up your household
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create a shared space for your medicine box.
          </p>

          {/* Tab Switcher */}
          <div className="mt-6 flex items-center gap-3 border-b border-slate-200 pb-2 text-sm font-semibold">
            <button
              onClick={() => setTab('create')}
              className={`pb-1 transition-colors ${
                tab === 'create'
                  ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Create new group
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => {
                setTab('join');
                setCurrentScreen('05_join_household');
              }}
              className={`pb-1 transition-colors ${
                tab === 'join'
                  ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Join existing
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
              <label className="block text-xs font-medium text-slate-400">Group name</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <div className="p-4 bg-[#F3F7F8] border border-slate-200/60 rounded-2xl space-y-1">
              <div className="text-xs font-semibold text-slate-700">
                Your generated invite code
              </div>
              <div className="text-xl font-mono font-bold text-[#1E7B99] tracking-wider">
                {inviteCode}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Share this code with people joining your household.
            </p>

            <div className="pt-6">
              <PillButton type="submit" variant="primary">
                Create group
              </PillButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 05 (Alt): Join Household
   ========================================================================= */
export const SetupJoinHousehold: React.FC = () => {
  const { joinHousehold, setCurrentScreen } = useApp();
  const [tab, setTab] = useState<'create' | 'join'>('join');
  const [code, setCode] = useState('CC-4826');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinHousehold(code);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="05 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Join your household
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter the invite code shared by your admin.
          </p>

          {/* Tab Switcher */}
          <div className="mt-6 flex items-center gap-3 border-b border-slate-200 pb-2 text-sm font-semibold">
            <button
              onClick={() => {
                setTab('create');
                setCurrentScreen('05_setup_household');
              }}
              className={`pb-1 transition-colors ${
                tab === 'create'
                  ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Create new group
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setTab('join')}
              className={`pb-1 transition-colors ${
                tab === 'join'
                  ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Join existing
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
              <label className="block text-xs font-medium text-slate-400">Invite code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CC-4826"
                className="w-full text-base font-mono font-bold text-slate-800 focus:outline-none bg-transparent mt-0.5 tracking-wider"
              />
            </div>

            <InfoCard variant="soft" className="space-y-1">
              <h3 className="font-semibold text-sm text-slate-800">
                Admin approval required
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your household admin will review your request before you can access the shared box.
              </p>
            </InfoCard>

            <div className="pt-6">
              <PillButton type="submit" variant="primary">
                Send join request
              </PillButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 06: Joining Household / Pending Approval
   ========================================================================= */
export const SetupPendingApproval: React.FC = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="06 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Joining your household
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Demo household · Invite code CC-4826
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="font-bold text-base text-slate-900">Demo household</div>
            <p className="text-xs text-slate-500 mt-1">Group access is pending approval.</p>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-[#F3F7F8] border border-slate-200/60 space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Request sent</h3>
            <div className="text-xs font-semibold text-slate-500">Awaiting approval</div>
            <p className="text-xs text-slate-600 pt-1">
              Your household admin will review your request.
            </p>
            <div className="pt-2">
              <StatusChip status="Awaiting approval" />
            </div>
          </div>

          {/* Admin shortcut test link */}
          <div className="mt-6 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex justify-between items-center">
            <span>Want to test the Admin approval screen?</span>
            <button
              onClick={() => setCurrentScreen('06_join_requests_admin')}
              className="font-bold underline ml-2"
            >
              Open Admin Review
            </button>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <PillButton
            variant="secondary"
            onClick={() => setCurrentScreen('05_setup_household')}
          >
            Cancel
          </PillButton>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 06 (Alt): Join Request Review (Admin Screen)
   ========================================================================= */
export const SetupJoinRequestsAdmin: React.FC = () => {
  const { approveJoinRequest, rejectJoinRequest, setCurrentScreen, state } = useApp();
  const request = state.joinRequests[0] || {
    id: 'req-jordan-1',
    userName: 'Sam Demo',
    requestedAt: '2026-10-14T08:30:00Z'
  };

  const handleApprove = () => {
    approveJoinRequest(request.id);
    setCurrentScreen('07_connect_box');
  };

  const handleReject = () => {
    rejectJoinRequest(request.id);
    setCurrentScreen('08_home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="06 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Join request
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review who can access your shared box.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="font-bold text-base text-slate-900">Demo household</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#1E7B99]" />
              Alex Demo · Admin
            </p>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-[#F3F7F8] border border-slate-200/60 space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {request.userName} wants to join your group
            </h3>
            <div className="text-xs text-slate-500">
              Join request · Demo household
            </div>
            <p className="text-xs text-slate-600 pt-1 leading-relaxed">
              Approve to give {request.userName} access to the household medicine box.
            </p>
            <div className="pt-2">
              <StatusChip status="Pending request" />
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <PillButton variant="primary" onClick={handleApprove}>
            Approve
          </PillButton>
          <PillButton variant="secondary" onClick={handleReject}>
            Reject
          </PillButton>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Screen 07: Connect your box (Bluetooth Pairing)
   ========================================================================= */
export const SetupConnectBox: React.FC = () => {
  const { connectBox, setCurrentScreen, setActiveTab } = useApp();
  const [isPairing, setIsPairing] = useState(false);
  const [paired, setPaired] = useState(true);

  const handleScanFirstMedicine = async () => {
    if (!paired) {
      setIsPairing(true);
      await connectBox();
      setIsPairing(false);
      setPaired(true);
    }
    setCurrentScreen('10_scan_medicine');
    setActiveTab('medicines');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScreenHeader sectionTag="07 / SETUP" showNavControls={false} />

      <div className="flex-1 px-6 pt-6 pb-24 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Connect your box
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            A few checks and you&apos;re ready to scan.
          </p>

          {/* Central Bluetooth Connection Graphic */}
          <div className="my-6 p-8 bg-[#F3F7F8] rounded-3xl border border-slate-200/60 flex flex-col items-center justify-center">
            <div className="flex items-center gap-5 mb-4 text-[#1E7B99]">
              <div className="w-12 h-16 rounded-xl border-2 border-[#1E7B99] flex items-center justify-center bg-white">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E7B99] mb-10" />
              </div>
              <Bluetooth className={`w-8 h-8 ${isPairing ? 'animate-bounce text-[#1E7B99]' : 'text-[#1E7B99]'}`} />
              <div className="w-14 h-14 rounded-xl border-2 border-[#1E7B99] flex items-center justify-center bg-white">
                <Box className="w-8 h-8 text-[#1E7B99]" />
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Phone + CareContinuum Box
            </span>
          </div>

          {/* Box info card */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1">
            <div className="font-bold text-base text-slate-900">
              CareContinuum Box · CC-1042
            </div>
            <p className="text-xs text-slate-500">
              Bluetooth connection established
            </p>
            <div className="pt-1">
              <StatusChip status="Paired" />
            </div>
          </div>

          {/* Checklist */}
          <div className="mt-4 p-4 bg-[#F3F7F8] rounded-2xl border border-slate-200/60 space-y-2">
            <div className="text-xs font-bold text-slate-800">Setup checklist</div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Power on the box</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Turn on Bluetooth</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Keep your phone within 2 metres</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <PillButton
            variant="primary"
            onClick={handleScanFirstMedicine}
            disabled={isPairing}
          >
            {isPairing ? 'Connecting to Box...' : 'Scan my first medicine'}
          </PillButton>
        </div>
      </div>
    </div>
  );
};
