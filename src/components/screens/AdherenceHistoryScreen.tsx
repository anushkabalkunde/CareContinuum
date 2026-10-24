/**
 * @license
 * CareContinuum - Adherence History Screen (Screen 16 / ROUTINES)
 * Weekly calendar strip, adherence compliance percentage, daily timeline,
 * and Doctor Clinical Export generator.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { StatusChip } from '../common/StatusChip';
import { ChevronLeft, FileDown, CheckCircle2 } from 'lucide-react';

export const AdherenceHistoryScreen: React.FC = () => {
  const {
    state,
    adherencePercentage,
    exportDoctorReport,
    setCurrentScreen,
    setActiveTab
  } = useApp();

  const [selectedDay, setSelectedDay] = useState('W 14');
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const days = [
    { label: 'M 12', active: false },
    { label: 'T 13', active: false },
    { label: 'W 14', active: true },
    { label: 'T 15', active: false },
    { label: 'F 16', active: false }
  ];

  const handleExport = () => {
    exportDoctorReport();
    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 4000);
  };

  const takenCount = state.doseLogs.filter((l) => l.status === 'Taken').length;
  const totalCount = state.doseLogs.length || 5;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="16 / ROUTINES" />

      <main className="px-5 pt-3 space-y-4">
        {/* Back navigation */}
        <button
          onClick={() => {
            setCurrentScreen('13_routines');
            setActiveTab('routines');
          }}
          className="flex items-center gap-1 text-xs font-semibold text-[#1E7B99] hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to routines</span>
        </button>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your adherence history
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sample placeholders — not actual health data.
          </p>
        </div>

        {/* Weekly Day Strip (Wireframe 27: M 12, T 13, W 14, T 15, F 16) */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {days.map((d) => (
            <button
              key={d.label}
              onClick={() => setSelectedDay(d.label)}
              className={`flex-1 py-2.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                selectedDay === d.label
                  ? 'border-[#1E7B99] bg-white text-[#1E7B99] shadow-xs'
                  : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Adherence Compliance Card */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1">
          <div className="font-extrabold text-xl text-slate-900">
            {adherencePercentage}% · Sample adherence
          </div>
          <p className="text-xs text-slate-600">
            {takenCount} of {totalCount} sample doses taken · 14 October
          </p>
          <p className="text-[11px] text-slate-400">
            Illustrative values only
          </p>
          <NotMedicalAdvice className="pt-1" />
        </div>

        {/* Timeline Logs Section */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">
            Wednesday, 14 October · Sample
          </h2>

          <div className="space-y-2.5">
            {state.doseLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">
                    {log.scheduledTime} · {log.medicineName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {log.medicineStrength} · Routine
                  </div>
                </div>

                <StatusChip status={log.status} />
              </div>
            ))}
          </div>
        </div>

        <NotMedicalAdvice />

        {/* Export for Doctor Pill Button */}
        <div className="pt-2">
          <PillButton
            variant="primary"
            onClick={handleExport}
            className="flex items-center justify-center gap-2"
          >
            <FileDown className="w-5 h-5" />
            <span>Export for doctor</span>
          </PillButton>

          {exportedSuccess && (
            <div className="p-3 mt-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Doctor adherence report generated and ready for print/download!</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
