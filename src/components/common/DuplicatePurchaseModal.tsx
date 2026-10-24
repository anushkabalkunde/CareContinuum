/**
 * @license
 * CareContinuum - Duplicate Purchase Modal
 * Implements the Architecture Flow requirement:
 * "Already in stock — DON'T BUY. Example: 18 tablets at home"
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { PillButton } from './PillButton';

export const DuplicatePurchaseModal: React.FC = () => {
  const {
    duplicateWarning,
    setDuplicateWarning,
    scannedTempMedicine,
    saveMedicine,
    setCurrentScreen,
    setActiveTab
  } = useApp();

  if (!duplicateWarning) return null;

  const handleRestockAnyway = () => {
    if (scannedTempMedicine) {
      saveMedicine(
        scannedTempMedicine as any,
        true // forceRestock = true
      );
      setDuplicateWarning(null);
      setCurrentScreen('09_medicines');
      setActiveTab('medicines');
    }
  };

  const handleCancel = () => {
    setDuplicateWarning(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-amber-200">
        {/* Banner header */}
        <div className="bg-amber-500 p-5 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-amber-100">
              Duplicate Purchase Check
            </div>
            <h2 className="text-lg font-bold">
              Already in stock — DON&apos;T BUY
            </h2>
          </div>
        </div>

        {/* Details body */}
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="font-semibold text-base">
              {scannedTempMedicine?.name} {scannedTempMedicine?.strength}
            </div>
            <p className="text-sm mt-1 text-amber-800">
              You already have <strong className="font-bold underline">{duplicateWarning.totalInStock} {scannedTempMedicine?.quantityUnit || 'tablets'}</strong> at home in the medicine box.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            This prevents accidental duplicate purchases and prevents medicine waste. If you intended to refill or restock existing stock, confirm below.
          </p>

          <div className="space-y-2 pt-2">
            <PillButton
              variant="secondary"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel (Don&apos;t Buy / Don&apos;t Add)</span>
            </PillButton>

            <PillButton
              variant="primary"
              onClick={handleRestockAnyway}
              className="flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Restock (Add Quantity Anyway)</span>
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
};
