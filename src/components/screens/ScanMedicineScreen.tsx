/**
 * @license
 * CareContinuum - Scan Medicine Screen (Screen 10, 15, 32 / MEDICINES)
 * Smart Box Camera + Device Camera Barcode/OCR recognition with simulated and live modes.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { PillButton } from '../common/PillButton';
import { NotMedicalAdvice } from '../common/NotMedicalAdvice';
import { Scan, Pill, Camera, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { KNOWN_BARCODES } from '../../services/medicineService';
import { Medicine } from '../../types';

type ScanState = 'scanning' | 'detected' | 'failed';

export const ScanMedicineScreen: React.FC = () => {
  const { setCurrentScreen, setScannedTempMedicine } = useApp();

  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [useLiveCamera, setUseLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedMed, setDetectedMed] = useState<Partial<Medicine>>({
    name: 'Paracetamol',
    strength: '500 mg',
    form: 'Tablet',
    purpose: 'Pain relief',
    expiryDate: '2027-12-12',
    quantityInStock: 24,
    quantityUnit: 'tablets',
    quantityThreshold: 5
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Simulated scan cycle
  useEffect(() => {
    let timer: any;
    if (scanState === 'scanning' && !useLiveCamera) {
      timer = setTimeout(() => {
        // Automatically detect medicine after 2 seconds
        setScanState('detected');
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [scanState, useLiveCamera]);

  // Handle live phone/webcam camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useLiveCamera && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera permission denied or unavailable:', err);
          setCameraError('Camera access not granted. Using smart box simulated feed.');
          setUseLiveCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useLiveCamera]);

  const handleReviewDetails = () => {
    setScannedTempMedicine(detectedMed);
    setCurrentScreen('11_check_scanned_details');
  };

  const handleEnterManually = () => {
    setScannedTempMedicine({
      name: '',
      strength: '',
      form: 'Tablet',
      purpose: '',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantityInStock: 20,
      quantityUnit: 'tablets',
      quantityThreshold: 5
    });
    setCurrentScreen('11_check_scanned_details');
  };

  const handleSelectSample = (barcode: string) => {
    const item = KNOWN_BARCODES[barcode];
    if (item) {
      setDetectedMed({
        name: item.name,
        strength: item.strength,
        form: item.form,
        purpose: item.purpose,
        expiryDate: '2027-12-12',
        quantityInStock: 24,
        quantityUnit: 'tablets',
        quantityThreshold: 5,
        storageInstructions: item.storage
      });
      setScanState('detected');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <ScreenHeader sectionTag="10 / MEDICINES" />

      <main className="px-5 pt-3 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {scanState === 'detected'
              ? 'Medicine detected'
              : scanState === 'failed'
              ? "Let's try that again"
              : 'Scan your medicine'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Use your box camera to read the label.
          </p>
        </div>

        {/* Camera Connected Status Pill */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F6F0] text-[#1B6A45] border border-[#B4E5D1]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Camera connected
          </span>
        </div>

        {/* Camera Viewport Graphic */}
        <div className="relative w-full aspect-[4/3] bg-[#F3F7F8] rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs">
          {useLiveCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}

          {/* Target Reticle Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="flex items-center justify-center gap-6 mb-3">
              <div className="relative w-14 h-14 flex items-center justify-center">
                {/* Reticle bracket corners */}
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#1E7B99]" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#1E7B99]" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#1E7B99]" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#1E7B99]" />
                <Scan className={`w-7 h-7 text-[#1E7B99] ${scanState === 'scanning' ? 'animate-pulse' : ''}`} />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xs shadow-xs border border-slate-200 flex items-center justify-center text-[#1E7B99]">
                <Pill className="w-7 h-7 -rotate-45" />
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-700 bg-white/90 px-3 py-1 rounded-full shadow-xs border border-slate-200/50">
              {scanState === 'scanning'
                ? 'Reading barcode and label…'
                : scanState === 'detected'
                ? 'Label recognised'
                : 'Scan could not read the label'}
            </div>
          </div>

          {/* Scanning line animation */}
          {scanState === 'scanning' && (
            <div className="absolute inset-x-8 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-[#1E7B99] to-transparent animate-pulse" />
          )}
        </div>

        {/* Live Camera vs Smart Box Mode Toggle */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setUseLiveCamera(!useLiveCamera)}
            className="text-xs text-[#1E7B99] font-semibold flex items-center gap-1 hover:underline"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{useLiveCamera ? 'Switch to Box simulated feed' : 'Use Phone Camera feed'}</span>
          </button>

          {scanState !== 'scanning' && (
            <button
              onClick={() => setScanState('scanning')}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rescan</span>
            </button>
          )}
        </div>

        {cameraError && (
          <p className="text-[11px] text-amber-600 px-1">{cameraError}</p>
        )}

        {/* State A: Scanning In Progress */}
        {scanState === 'scanning' && (
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1">
            <h3 className="font-bold text-sm text-slate-900">
              Scanning in progress
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Place the medicine label in front of the box camera and keep it steady.
            </p>
            <NotMedicalAdvice />
          </div>
        )}

        {/* State B: Medicine Detected (Wireframe Page 15) */}
        {scanState === 'detected' && (
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                {detectedMed.name} {detectedMed.strength}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Name and strength detected. Confirm the scanned details before saving.
            </p>
            <NotMedicalAdvice />
          </div>
        )}

        {/* State C: Failed / Let's Try That Again (Wireframe Page 32) */}
        {scanState === 'failed' && (
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-amber-700">
              <h3 className="font-bold text-sm">We couldn&apos;t read this label</h3>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check that the label is visible, or enter your medicine details manually.
            </p>
            <NotMedicalAdvice />
          </div>
        )}

        {/* Quick Sample Presets for Demo Testing */}
        <div className="p-3 bg-[#F3F7F8] rounded-2xl border border-slate-200/60 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-600">Simulate Barcode / OCR Detection:</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSelectSample('8901234567890')}
              className="text-[11px] bg-white border px-2 py-1 rounded-lg text-slate-700 hover:border-[#1E7B99]"
            >
              Paracetamol 500mg
            </button>
            <button
              onClick={() => handleSelectSample('8901234567891')}
              className="text-[11px] bg-white border px-2 py-1 rounded-lg text-slate-700 hover:border-[#1E7B99]"
            >
              Amoxicillin 250mg
            </button>
            <button
              onClick={() => handleSelectSample('8901234567892')}
              className="text-[11px] bg-white border px-2 py-1 rounded-lg text-slate-700 hover:border-[#1E7B99]"
            >
              Cetirizine 10mg
            </button>
            <button
              onClick={() => setScanState('failed')}
              className="text-[11px] bg-white border px-2 py-1 rounded-lg text-rose-600 hover:border-rose-400"
            >
              Simulate Failure
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2.5 pt-2">
          {scanState === 'detected' ? (
            <PillButton variant="primary" onClick={handleReviewDetails}>
              Review details
            </PillButton>
          ) : scanState === 'failed' ? (
            <PillButton variant="primary" onClick={() => setScanState('scanning')}>
              Retry scan
            </PillButton>
          ) : (
            <PillButton variant="primary" onClick={() => setScanState('detected')}>
              Scan medicine
            </PillButton>
          )}

          <PillButton variant="secondary" onClick={handleEnterManually}>
            Enter manually
          </PillButton>
        </div>
      </main>
    </div>
  );
};
