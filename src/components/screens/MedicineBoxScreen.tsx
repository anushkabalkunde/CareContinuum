/**
 * @license
 * CareContinuum - Medicine Box Hardware Screen (Screen 18 & 34 / HOME)
 * ESP32 Smart Box status, Bluetooth connection, battery, camera health, and offline simulation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { StatusChip } from '../common/StatusChip';
import { Box, Bluetooth, ChevronLeft, RefreshCw, Power } from 'lucide-react';

export const MedicineBoxScreen: React.FC = () => {
  const {
    state,
    setCurrentScreen,
    toggleBoxOnline,
    connectBox
  } = useApp();

  const [isRepairing, setIsRepairing] = useState(false);
  const isOnline = state.boxStatus.isOnline;

  const handleRepair = async () => {
    setIsRepairing(true);
    await new Promise((r) => setTimeout(r, 1500));
    await connectBox();
    setIsRepairing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <ScreenHeader sectionTag="18 / HOME" />

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
            Your medicine box
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CareContinuum Box · CC-1042
          </p>
        </div>

        {/* Visual Box Status Container */}
        <div className="my-2 p-8 bg-[#F3F7F8] rounded-3xl border border-slate-200/60 flex flex-col items-center justify-center">
          <div className="flex items-center gap-6 mb-3 text-[#1E7B99]">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center">
              <Box className="w-8 h-8" />
            </div>
            <Bluetooth className={`w-8 h-8 ${isOnline ? 'text-[#1E7B99]' : 'text-slate-400'}`} />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {isOnline ? 'Paired to this phone' : 'Box connection unavailable'}
          </span>
        </div>

        {/* Offline Warning Card (Wireframe 34) */}
        {!isOnline && (
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Box is offline</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Power on your box, enable Bluetooth and keep your phone within 2 metres.
            </p>
          </div>
        )}

        {/* Connection Detail Card */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-bold text-sm text-slate-900">Connection</div>
            <div className="text-xs text-slate-500">
              {isOnline ? 'Bluetooth connected' : `Offline · Last synced ${state.boxStatus.lastSynced}`}
            </div>
          </div>
          <StatusChip status={isOnline ? 'Paired' : 'Offline'} />
        </div>

        {/* Battery Detail Card */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-bold text-sm text-slate-900">Battery</div>
            <div className="text-xs text-slate-500">
              {isOnline ? 'Sample reading' : 'Last known reading · Sample'}
            </div>
          </div>
          <StatusChip status={`${state.boxStatus.batteryPercentage}% · OK`} />
        </div>

        {/* Camera Health Detail Card */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-bold text-sm text-slate-900">Camera health</div>
            <div className="text-xs text-slate-500">
              {isOnline ? 'Ready to read labels' : 'Unavailable while offline'}
            </div>
          </div>
          <StatusChip status={isOnline ? 'OK' : 'Pending'} />
        </div>

        {/* Simulator Toggle for Demo presentation */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
          <span className="text-slate-600 font-medium">Simulator: Test Offline State</span>
          <button
            onClick={toggleBoxOnline}
            className="px-3 py-1 bg-white border rounded-xl font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? 'Simulate Disconnect' : 'Simulate Connect'}</span>
          </button>
        </div>

        {/* Re-pair box Pill Button */}
        <div className="pt-2">
          <PillButton
            variant="primary"
            onClick={handleRepair}
            disabled={isRepairing}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRepairing ? 'animate-spin' : ''}`} />
            <span>{isRepairing ? 'Re-pairing CC-1042...' : 'Re-pair box'}</span>
          </PillButton>
        </div>
      </main>
    </div>
  );
};
