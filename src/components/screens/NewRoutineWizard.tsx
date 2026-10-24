/**
 * @license
 * CareContinuum - New Routine Wizard (Screen 14 / ROUTINES - 3 Steps)
 * Step 1: Choose a medicine
 * Step 2: Set dose and times
 * Step 3: Set the duration (Short-term course vs Chronic routine)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { ChevronLeft, Search, Plus, Trash2 } from 'lucide-react';
import { Medicine } from '../../types';

export const NewRoutineWizard: React.FC = () => {
  const {
    state,
    selectedMedicine,
    createRoutine,
    setCurrentScreen,
    setActiveTab
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [chosenMedicine, setChosenMedicine] = useState<Medicine | null>(
    selectedMedicine || state.medicines[0] || null
  );

  // Step 2 Form
  const [doseAmount, setDoseAmount] = useState(1);
  const [doseUnit, setDoseUnit] = useState('tablet');
  const [timesPerDay, setTimesPerDay] = useState(2);
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(['8:00 AM', '8:00 PM']);

  // Step 3 Form
  const [durationType, setDurationType] = useState<'days' | 'ongoing'>('days');
  const [durationDays, setDurationDays] = useState(5);
  const [startDate, setStartDate] = useState('2026-10-14');
  const [routineTitle, setRoutineTitle] = useState('Fever course');

  const filteredMedicines = state.medicines.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTime = () => {
    setScheduleTimes([...scheduleTimes, '12:00 PM']);
    setTimesPerDay(timesPerDay + 1);
  };

  const handleRemoveTime = (index: number) => {
    if (scheduleTimes.length > 1) {
      setScheduleTimes(scheduleTimes.filter((_, i) => i !== index));
      setTimesPerDay(timesPerDay - 1);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenMedicine) return;

    createRoutine({
      medicineId: chosenMedicine.id,
      medicineName: chosenMedicine.name,
      medicineStrength: chosenMedicine.strength,
      title: routineTitle || `${chosenMedicine.name} routine`,
      type: durationType === 'days' ? 'short-term' : 'chronic',
      memberId: chosenMedicine.assignedMemberId || state.user?.id || 'admin',
      doseAmount,
      doseUnit,
      timesPerDay: scheduleTimes.length,
      scheduleTimes,
      startDate,
      durationDays: durationType === 'days' ? durationDays : undefined,
      currentDay: durationType === 'days' ? 1 : undefined,
      isOngoing: durationType === 'ongoing'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <ScreenHeader sectionTag="14 / ROUTINES" />

      <main className="px-5 pt-3 space-y-4">
        {/* Back navigation */}
        <button
          onClick={() => {
            if (step === 3) setStep(2);
            else if (step === 2) setStep(1);
            else {
              setCurrentScreen('13_routines');
              setActiveTab('routines');
            }
          }}
          className="flex items-center gap-1 text-xs font-semibold text-[#1E7B99] hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{step === 1 ? 'Cancel routine' : 'Back'}</span>
        </button>

        {/* Step indicator tag */}
        <div className="text-xs font-bold text-slate-400">
          Step {step} of 3
        </div>

        {/* =========================================================================
            Step 1 of 3: Choose a medicine
            ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Choose a medicine
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Create routine · 1 of 3 · Sample values
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 ml-1">
                Search medicines
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="e.g. Paracetamol"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/90 rounded-2xl py-3 px-4 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E7B99]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5" />
              </div>
            </div>

            {/* Radio List of Medicines */}
            <div className="space-y-2.5 pt-1">
              {filteredMedicines.map((med) => {
                const isSelected = chosenMedicine?.id === med.id;
                return (
                  <div
                    key={med.id}
                    onClick={() => setChosenMedicine(med)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1E7B99] bg-[#EBF5F8]/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg text-[#1E7B99]">
                        {isSelected ? '◉' : '○'}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900">
                          {med.name} {med.strength}
                        </div>
                        <div className="text-xs text-slate-500">
                          {med.form} · {med.purpose}
                        </div>
                        <div className="text-xs text-slate-400">
                          {med.quantityInStock} tablets left · Exp: {med.expiryDate}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 pt-1">
              Choose the medicine for this routine.
            </p>
            <NotMedicalAdvice />

            <div className="pt-4">
              <PillButton
                variant="primary"
                disabled={!chosenMedicine}
                onClick={() => setStep(2)}
              >
                Continue
              </PillButton>
            </div>
          </div>
        )}

        {/* =========================================================================
            Step 2 of 3: Set dose and times
            ========================================================================= */}
        {step === 2 && chosenMedicine && (
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Set dose and times
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Create routine · 2 of 3 · Sample values
              </p>
            </div>

            {/* Selected Medicine Summary Card */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1">
              <div className="font-bold text-base text-slate-900">
                {chosenMedicine.name} {chosenMedicine.strength}
              </div>
              <p className="text-xs text-slate-500">
                {chosenMedicine.form} · Sample routine
              </p>
              <NotMedicalAdvice />
            </div>

            {/* Dose Input */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
              <label className="block text-xs font-medium text-slate-400">Dose</label>
              <div className="flex items-center gap-2 mt-0.5">
                <input
                  type="number"
                  min="1"
                  value={doseAmount}
                  onChange={(e) => setDoseAmount(Number(e.target.value))}
                  className="w-16 text-base font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-sm font-semibold text-slate-600">
                  {doseAmount > 1 ? `${doseUnit}s` : doseUnit} · Sample
                </span>
              </div>
            </div>

            {/* Times per day */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
              <label className="block text-xs font-medium text-slate-400">Times per day</label>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {scheduleTimes.length}
              </div>
            </div>

            {/* Time Pickers (Wireframe 23: 8:00 AM, 8:00 PM) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Scheduled Times</label>
              <div className="grid grid-cols-2 gap-3">
                {scheduleTimes.map((time, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Time {idx + 1}</span>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => {
                          const updated = [...scheduleTimes];
                          updated[idx] = e.target.value;
                          setScheduleTimes(updated);
                        }}
                        className="text-sm font-bold text-slate-800 focus:outline-none w-20"
                      />
                    </div>
                    {scheduleTimes.length > 1 && (
                      <button
                        onClick={() => handleRemoveTime(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddTime}
                className="text-xs text-[#1E7B99] font-bold flex items-center gap-1 hover:underline pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add another time slot</span>
              </button>
            </div>

            <NotMedicalAdvice />

            <div className="pt-4">
              <PillButton variant="primary" onClick={() => setStep(3)}>
                Continue
              </PillButton>
            </div>
          </div>
        )}

        {/* =========================================================================
            Step 3 of 3: Set duration
            ========================================================================= */}
        {step === 3 && chosenMedicine && (
          <form onSubmit={handleFinish} className="space-y-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Set the duration
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Create routine · 3 of 3 · Sample values
              </p>
            </div>

            {/* Medicine and Dose Summary Card */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1">
              <div className="font-bold text-base text-slate-900">
                {chosenMedicine.name} {chosenMedicine.strength}
              </div>
              <p className="text-xs text-slate-500">
                {doseAmount} {doseUnit} · {scheduleTimes.join(' and ')} · Sample
              </p>
              <NotMedicalAdvice />
            </div>

            {/* Title / Diagnosis for this routine */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
              <label className="block text-xs font-medium text-slate-400">Routine Title</label>
              <input
                type="text"
                required
                value={routineTitle}
                onChange={(e) => setRoutineTitle(e.target.value)}
                placeholder="e.g. Fever course, Blood pressure"
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            {/* Number of days | Ongoing Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setDurationType('days')}
                className={`pb-1 transition-colors ${
                  durationType === 'days'
                    ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Number of days
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setDurationType('ongoing')}
                className={`pb-1 transition-colors ${
                  durationType === 'ongoing'
                    ? 'text-[#1E7B99] border-b-2 border-[#1E7B99]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Ongoing
              </button>
            </div>

            {/* Duration Days (if days selected) */}
            {durationType === 'days' && (
              <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
                <label className="block text-xs font-medium text-slate-400">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
                />
              </div>
            )}

            {/* Start Date */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl">
              <label className="block text-xs font-medium text-slate-400">Start date</label>
              <input
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <p className="text-xs text-slate-500">
              Days creates a Short-term course. Ongoing creates a Chronic routine.
            </p>

            <NotMedicalAdvice />

            <div className="pt-4">
              <PillButton type="submit" variant="primary">
                Create routine
              </PillButton>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
