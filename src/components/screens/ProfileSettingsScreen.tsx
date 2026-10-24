/**
 * @license
 * CareContinuum - Profile & Settings Screen (Screen 19 / HOME)
 * User account, notification preferences, emergency contact, allergy info,
 * data seeding & reset controls.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { ChevronLeft, CheckCircle2, RotateCcw, Trash2, HelpCircle, BookOpen } from 'lucide-react';

export const ProfileSettingsScreen: React.FC = () => {
  const {
    state,
    setCurrentScreen,
    updateEmergencyInfo,
    updateNotificationPreferences,
    loadDemoData,
    clearAllData,
    signOut,
    setIsDocsModalOpen
  } = useApp();

  const user = state.user;

  // Form states
  const [allergies, setAllergies] = useState(user?.emergencyInfo.allergies || 'Penicillin, Dust mites');
  const [contactName, setContactName] = useState(user?.emergencyInfo.emergencyContactName || 'Sam Demo');
  const [contactPhone, setContactPhone] = useState(user?.emergencyInfo.emergencyContactPhone || '000 000 0000');

  // Notification toggles
  const [doseReminders, setDoseReminders] = useState(user?.notificationPreferences.doseReminders ?? true);
  const [missedDose, setMissedDose] = useState(user?.notificationPreferences.missedDose ?? true);
  const [expiryWarnings, setExpiryWarnings] = useState(user?.notificationPreferences.expiryWarnings ?? true);
  const [lowStock, setLowStock] = useState(user?.notificationPreferences.lowStock ?? true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmergencyInfo({
      allergies,
      emergencyContactName: contactName,
      emergencyContactPhone: contactPhone
    });
    updateNotificationPreferences({
      doseReminders,
      missedDose,
      expiryWarnings,
      lowStock,
      caregiverAlerts: true,
      soundEnabled: true
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="19 / HOME" />

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
            Profile and settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your account and care preferences.
          </p>
        </div>

        {/* User Card (Wireframe 30) */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-0.5">
          <div className="font-bold text-base text-slate-900">
            {user?.name || 'Alex Demo'}
          </div>
          <div className="text-xs text-slate-500">
            {user?.email || 'alex@example.com'} · {user?.mode === 'household' ? 'Household account' : 'Individual account'}
          </div>
        </div>

        <form onSubmit={handleSaveChanges} className="space-y-4">
          {/* Notification Preferences Card */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">
              Notification preferences
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <label className="flex items-center justify-between">
                <span>Dose reminders</span>
                <input
                  type="checkbox"
                  checked={doseReminders}
                  onChange={(e) => setDoseReminders(e.target.checked)}
                  className="w-4 h-4 text-[#1E7B99] rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Missed dose alerts</span>
                <input
                  type="checkbox"
                  checked={missedDose}
                  onChange={(e) => setMissedDose(e.target.checked)}
                  className="w-4 h-4 text-[#1E7B99] rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Expiry warnings</span>
                <input
                  type="checkbox"
                  checked={expiryWarnings}
                  onChange={(e) => setExpiryWarnings(e.target.checked)}
                  className="w-4 h-4 text-[#1E7B99] rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Low stock alerts</span>
                <input
                  type="checkbox"
                  checked={lowStock}
                  onChange={(e) => setLowStock(e.target.checked)}
                  className="w-4 h-4 text-[#1E7B99] rounded"
                />
              </label>
            </div>
          </div>

          {/* Emergency Information Header */}
          <h2 className="text-base font-bold text-slate-900 pt-1">
            Emergency information
          </h2>

          {/* Allergies Card */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
            <label className="block text-xs font-semibold text-slate-700">Allergies</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts"
              className="w-full text-xs text-slate-600 focus:outline-none bg-transparent mt-1"
            />
          </div>

          {/* Emergency Contact Card */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Emergency contact</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Name"
                className="w-full text-xs text-slate-600 focus:outline-none bg-transparent"
              />
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full text-xs text-slate-600 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Help & Documentation Links */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => setIsDocsModalOpen(true)}
              className="w-full p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#1E7B99]" />
                  <span>Architecture & Database Guide</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  View storage locations, Firestore sync & APK build
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 rotate-180 text-slate-400" />
            </button>

            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-0.5">
              <div className="font-bold text-sm text-slate-900">Help</div>
              <p className="text-xs text-slate-500">
                CareContinuum help and support · Companion box pairing instructions
              </p>
            </div>
          </div>

          {/* Demo Data & Reset Tools */}
          <div className="p-4 bg-[#F3F7F8] rounded-2xl border border-slate-200/60 space-y-2">
            <div className="text-xs font-bold text-slate-700">Demo & Diagnostic Tools</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadDemoData}
                className="flex-1 py-2 px-3 bg-white border border-slate-200 text-[#1E7B99] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Demo Data</span>
              </button>
              <button
                type="button"
                onClick={clearAllData}
                className="py-2 px-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Log Out */}
          <div
            onClick={signOut}
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-0.5 cursor-pointer hover:bg-rose-50/50 transition-colors"
          >
            <div className="font-bold text-sm text-rose-600">Log out</div>
            <p className="text-xs text-slate-500">Sign out of your account</p>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preferences and emergency info saved successfully!</span>
            </div>
          )}

          {/* Save Changes Pill Button */}
          <div className="pt-2">
            <PillButton type="submit" variant="primary">
              Save changes
            </PillButton>
          </div>
        </form>
      </main>
    </div>
  );
};
