/**
 * @license
 * CareContinuum - Check Scanned Details Screen (Screen 11 & 17 / MEDICINES)
 * Editable scanned details, household member assignment, routine toggle,
 * and duplicate purchase checker interception.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { ChevronLeft } from 'lucide-react';
import { MedicineForm } from '../../types';

export const CheckScannedDetailsScreen: React.FC = () => {
  const {
    scannedTempMedicine,
    saveMedicine,
    state,
    setCurrentScreen,
    setActiveTab,
    setSelectedMedicine
  } = useApp();

  const members = state.household?.members || [];

  const [name, setName] = useState(scannedTempMedicine?.name || 'Paracetamol');
  const [strength, setStrength] = useState(scannedTempMedicine?.strength || '500 mg');
  const [form, setForm] = useState<MedicineForm>((scannedTempMedicine?.form as MedicineForm) || 'Tablet');
  const [purpose, setPurpose] = useState(scannedTempMedicine?.purpose || 'Pain relief');
  const [expiryDate, setExpiryDate] = useState(scannedTempMedicine?.expiryDate || '2027-12-12');
  const [quantity, setQuantity] = useState(scannedTempMedicine?.quantityInStock || 24);
  const [quantityUnit, setQuantityUnit] = useState(scannedTempMedicine?.quantityUnit || 'tablets');
  const [assignedPersonId, setAssignedPersonId] = useState(
    scannedTempMedicine?.assignedMemberId || (members[0]?.id || 'all')
  );
  const [addToRoutine, setAddToRoutine] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const medData = {
      name: name.trim(),
      strength: strength.trim(),
      form,
      purpose: purpose.trim(),
      expiryDate,
      quantityInStock: Number(quantity),
      quantityUnit,
      quantityThreshold: 5,
      assignedMemberId: assignedPersonId,
      storageInstructions: 'Store in a cool, dry place'
    };

    const saved = saveMedicine(medData, false);
    if (saved) {
      if (addToRoutine) {
        // Carry forward to Routine Creation
        setSelectedMedicine({
          id: 'temp-created',
          ...medData,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
        setCurrentScreen('14_new_routine_wizard');
        setActiveTab('routines');
      } else {
        setCurrentScreen('09_medicines');
        setActiveTab('medicines');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <ScreenHeader sectionTag="11 / MEDICINES" />

      <main className="px-5 pt-3 space-y-4">
        {/* Back navigation */}
        <button
          onClick={() => setCurrentScreen('10_scan_medicine')}
          className="flex items-center gap-1 text-xs font-semibold text-[#1E7B99] hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to scan</span>
        </button>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Check scanned details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Scanned values are editable. Please confirm.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {/* Name Field */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
            <label className="block text-xs font-medium text-slate-400">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
            />
          </div>

          {/* Strength and Form Fields (2 columns) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Strength</label>
              <input
                type="text"
                required
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Form</label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value as MedicineForm)}
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Drops">Drops</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Injection">Injection</option>
              </select>
            </div>
          </div>

          {/* Purpose Field */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
            <label className="block text-xs font-medium text-slate-400">Purpose</label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Pain relief, Fever relief"
              className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
            />
          </div>

          {/* Expiry Date and Quantity Fields (2 columns) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Expiry date</label>
              <input
                type="text"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="YYYY-MM-DD or DD MMM YYYY"
                className="w-full text-base font-semibold text-slate-800 focus:outline-none bg-transparent mt-0.5"
              />
            </div>

            <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl focus-within:border-[#1E7B99]">
              <label className="block text-xs font-medium text-slate-400">Quantity</label>
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 text-base font-semibold text-slate-800 focus:outline-none bg-transparent"
                />
                <input
                  type="text"
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-20 text-xs font-medium text-slate-500 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Assigned Person (Wireframe 17 / MEDICINES) */}
          {state.household && members.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700">
                Assigned person
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {members.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setAssignedPersonId(m.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      assignedPersonId === m.id
                        ? 'border-[#1E7B99] bg-[#EBF5F8] text-[#1E7B99]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to a Routine Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <span className="text-sm font-semibold text-slate-800">
              Add to a routine
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={addToRoutine}
              onClick={() => setAddToRoutine(!addToRoutine)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                addToRoutine ? 'bg-[#1E7B99]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  addToRoutine ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <NotMedicalAdvice />

          {/* Save Medicine Pill Button */}
          <div className="pt-3">
            <PillButton type="submit" variant="primary">
              Save medicine
            </PillButton>
          </div>
        </form>
      </main>
    </div>
  );
};
