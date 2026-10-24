/**
 * @license
 * CareContinuum - Medicine Details Screen (Screen 12 & 36 / MEDICINES)
 * Detailed stock, storage, linked routines, dose history, and discard actions.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { StatusChip } from '../common/StatusChip';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { getMedicineStatus } from '../../services/medicineService';
import { ChevronLeft, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const MedicineDetailsScreen: React.FC = () => {
  const {
    selectedMedicine,
    discardMedicine,
    updateMedicine,
    state,
    setCurrentScreen
  } = useApp();

  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(selectedMedicine?.name || '');
  const [editStrength, setEditStrength] = useState(selectedMedicine?.strength || '');
  const [editQuantity, setEditQuantity] = useState(selectedMedicine?.quantityInStock || 0);
  const [editExpiry, setEditExpiry] = useState(selectedMedicine?.expiryDate || '');
  const [editPurpose, setEditPurpose] = useState(selectedMedicine?.purpose || '');

  if (!selectedMedicine) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">No medicine selected.</p>
        <button
          onClick={() => setCurrentScreen('09_medicines')}
          className="mt-4 text-[#1E7B99] font-bold text-xs underline"
        >
          Return to medicines
        </button>
      </div>
    );
  }

  const status = getMedicineStatus(selectedMedicine);
  const isExpired = status === 'Expired';

  // Find linked routines
  const linkedRoutines = state.routines.filter(
    (r) => r.medicineId === selectedMedicine.id || r.medicineName.toLowerCase() === selectedMedicine.name.toLowerCase()
  );

  // Find dose logs for this medicine
  const medLogs = state.doseLogs.filter(
    (l) => l.medicineId === selectedMedicine.id || l.medicineName.toLowerCase() === selectedMedicine.name.toLowerCase()
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMedicine({
      ...selectedMedicine,
      name: editName,
      strength: editStrength,
      quantityInStock: Number(editQuantity),
      expiryDate: editExpiry,
      purpose: editPurpose
    });
    setIsEditing(false);
  };

  const handleDiscard = () => {
    discardMedicine(selectedMedicine.id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-28">
      <ScreenHeader sectionTag="12 / MEDICINES" />

      <main className="px-5 pt-3 space-y-4">
        {/* Back navigation */}
        <button
          onClick={() => setCurrentScreen('09_medicines')}
          className="flex items-center gap-1 text-xs font-semibold text-[#1E7B99] hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to medicines</span>
        </button>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Medicine details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {selectedMedicine.name} {selectedMedicine.strength}
          </p>
        </div>

        {!isEditing ? (
          <>
            {/* Main Info Card */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
              <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedMedicine.name} {selectedMedicine.strength}
                </h2>
                <p className="text-xs text-slate-600">
                  {selectedMedicine.form} · {selectedMedicine.purpose}
                </p>
              </div>

              {/* Expired Warning Banner (Wireframe Page 36) */}
              {isExpired && (
                <div className="p-3 bg-[#FDE8E8] border border-[#F8B4B4] rounded-xl flex items-start gap-2.5 text-[#C53030]">
                  <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong>Expired — do not use.</strong> Ask a pharmacist about safe disposal.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <StatusChip status={status} />
                <NotMedicalAdvice />
              </div>
            </div>

            {/* Stock and Storage Card */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
              <h3 className="font-bold text-sm text-slate-900">
                Stock and storage
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  Strength: <strong>{selectedMedicine.strength}</strong> · Expiry: <strong>{selectedMedicine.expiryDate}</strong>
                </div>
                <div>
                  Quantity: <strong className={selectedMedicine.quantityInStock < selectedMedicine.quantityThreshold ? 'text-amber-600 font-bold' : ''}>
                    {selectedMedicine.quantityInStock} {selectedMedicine.quantityUnit}
                  </strong> · {selectedMedicine.storageInstructions || 'Store in a cool, dry place'}
                </div>
              </div>
            </div>

            {/* Linked Routines Card */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
              <h3 className="font-bold text-sm text-slate-900">
                Linked routines
              </h3>
              {linkedRoutines.length > 0 ? (
                linkedRoutines.map((r) => (
                  <div key={r.id} className="p-3 bg-[#F3F7F8] rounded-xl text-xs space-y-0.5">
                    <div className="font-bold text-slate-900">
                      {r.title} {r.durationDays ? `· Day ${r.currentDay || 1} of ${r.durationDays}` : '· Ongoing'}
                    </div>
                    <div className="text-slate-500">
                      {r.scheduleTimes.join(', ')} · Routine
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No active routines linked to this medicine.</p>
              )}
            </div>

            {/* Dose History Card */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
              <h3 className="font-bold text-sm text-slate-900">
                Dose history · Sample
              </h3>
              {medLogs.length > 0 ? (
                <div className="space-y-1.5 text-xs text-slate-600">
                  {medLogs.slice(0, 3).map((l) => (
                    <div key={l.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                      <span>{l.date} · {l.scheduledTime}</span>
                      <span className={`font-semibold ${l.status === 'Taken' ? 'text-emerald-700' : 'text-rose-600'}`}>
                        — {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Today · 8:00 AM — Taken</div>
                  <div>Yesterday · 8:00 PM — Taken</div>
                </div>
              )}
            </div>

            <NotMedicalAdvice />

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <PillButton
                variant="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit medicine
              </PillButton>

              <PillButton
                variant="danger"
                onClick={() => setIsDiscardConfirmOpen(true)}
              >
                Discard medicine
              </PillButton>
            </div>
          </>
        ) : (
          /* Editable Form */
          <form onSubmit={handleSaveEdit} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Edit Medicine Details</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Strength</label>
              <input
                type="text"
                value={editStrength}
                onChange={(e) => setEditStrength(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity in Stock</label>
              <input
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Expiry Date</label>
              <input
                type="date"
                value={editExpiry}
                onChange={(e) => setEditExpiry(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose</label>
              <input
                type="text"
                value={editPurpose}
                onChange={(e) => setEditPurpose(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <PillButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </PillButton>
              <PillButton type="submit" variant="primary" size="sm">
                Save Changes
              </PillButton>
            </div>
          </form>
        )}

        {/* Discard Confirmation Modal */}
        {isDiscardConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl border border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Discard {selectedMedicine.name}?
              </h3>
              <p className="text-xs text-slate-600">
                This will remove the medicine from your box inventory and cancel any associated routines.
              </p>
              <div className="flex gap-2 pt-2">
                <PillButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsDiscardConfirmOpen(false)}
                >
                  Keep Medicine
                </PillButton>
                <PillButton
                  variant="danger"
                  size="sm"
                  onClick={handleDiscard}
                >
                  Confirm Discard
                </PillButton>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
