/**
 * @license
 * CareContinuum - Alerts Screen & Confirm Dose Modal (Screen 15 & 26 / ALERTS)
 * Stock warnings, Expiry reminders, Dose Due, and Dose confirmation with stock decrement.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { StatusChip } from '../common/StatusChip';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { Bell, Check, Clock, AlertTriangle, AlertOctagon, X } from 'lucide-react';

/* =========================================================================
   Screen 15: Alerts Screen
   ========================================================================= */
export const AlertsScreen: React.FC = () => {
  const {
    state,
    dismissAlert,
    setConfirmDoseTarget,
    confirmDoseTarget,
    setCurrentScreen
  } = useApp();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const activeAlerts = state.alerts.filter((a) => !a.dismissed);

  const handleOpenConfirm = (alertItem?: any) => {
    const targetLog = state.doseLogs.find((l) => l.status === 'Upcoming') || state.doseLogs[0];
    setConfirmDoseTarget(targetLog);
    setIsConfirmModalOpen(true);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'dose_due':
        return <Clock className="w-4 h-4 text-[#1E7B99]" />;
      case 'missed_dose':
        return <AlertOctagon className="w-4 h-4 text-rose-500" />;
      case 'expiring_soon':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="15 / ALERTS" />

      <main className="px-5 pt-3 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reminders and stock warnings · Sample data
          </p>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 pt-1">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (alert.type === 'dose_due' || alert.type === 'missed_dose') {
                    handleOpenConfirm(alert);
                  }
                }}
                className={`p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs transition-all ${
                  alert.type === 'dose_due' || alert.type === 'missed_dose'
                    ? 'cursor-pointer hover:border-[#1E7B99]/50'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-400 uppercase tracking-wide">
                      {getAlertIcon(alert.type)}
                      <span>{alert.title}</span>
                    </div>

                    <div className="font-bold text-sm text-slate-900">
                      {alert.subtitle.split(' · ')[0]}
                    </div>

                    <div className="text-xs text-slate-500">
                      {alert.subtitle.split(' · ').slice(1).join(' · ')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusChip status={alert.statusLabel} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      className="text-slate-300 hover:text-slate-500 p-1"
                      title="Dismiss alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No active alerts. All reminders and stock levels are in good standing.
            </div>
          )}
        </div>

        <NotMedicalAdvice />

        {/* Bottom Action Button: Confirm dose */}
        <div className="pt-2">
          <PillButton variant="primary" onClick={() => handleOpenConfirm()}>
            Confirm dose
          </PillButton>
        </div>

        {/* Confirm Dose Modal (Wireframe Page 26) */}
        {isConfirmModalOpen && (
          <ConfirmDoseModal onClose={() => setIsConfirmModalOpen(false)} />
        )}
      </main>
    </div>
  );
};

/* =========================================================================
   Screen 26: Confirm Your Dose Modal
   ========================================================================= */
export const ConfirmDoseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { confirmDoseTarget, logDoseAction, todayDosesSummary } = useApp();

  const handleAction = (action: 'Taken' | 'Skipped' | 'Snoozed') => {
    const targetId = confirmDoseTarget ? (confirmDoseTarget as any).id : 'log-1';
    logDoseAction(targetId, action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-[#1E7B99] uppercase tracking-wider">
            15 / ALERTS
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Confirm your dose
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Log what happened with this reminder.
            </p>
          </div>

          {/* Dose due preview card */}
          {(() => {
            const medName =
              confirmDoseTarget && 'medicineName' in confirmDoseTarget
                ? confirmDoseTarget.medicineName
                : confirmDoseTarget?.title === 'Dose due'
                ? confirmDoseTarget.subtitle.split(' · ')[0]
                : 'Paracetamol 500 mg';

            return (
              <>
                <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-0.5">
                  <div className="font-bold text-sm text-slate-900">
                    Dose due · 12:00 PM
                  </div>
                  <div className="text-xs text-slate-500">
                    {medName} · Fever course
                  </div>
                  <NotMedicalAdvice className="pt-0.5" />
                </div>

                {/* Have you taken this dose card */}
                <div className="p-4 bg-[#F3F7F8] border border-slate-200/60 rounded-2xl space-y-2">
                  <h3 className="font-bold text-base text-slate-900">
                    Have you taken this dose?
                  </h3>
                  <p className="text-xs text-slate-600">
                    {medName} · 1 tablet · Sample
                  </p>
                  <p className="text-xs text-slate-500">
                    12:00 PM · Fever course
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Your confirmation is logged in Adherence history.
                  </p>
                </div>
              </>
            );
          })()}

          <NotMedicalAdvice />

          {/* Skip and Snooze options */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <PillButton
              variant="secondary"
              size="md"
              onClick={() => handleAction('Skipped')}
            >
              Skip
            </PillButton>
            <PillButton
              variant="secondary"
              size="md"
              onClick={() => handleAction('Snoozed')}
            >
              Snooze
            </PillButton>
          </div>

          {/* Taken primary button (Subtacts dose from stock: 20 -> 19!) */}
          <PillButton
            variant="primary"
            size="lg"
            onClick={() => handleAction('Taken')}
            className="flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Taken</span>
          </PillButton>
        </div>
      </div>
    </div>
  );
};
