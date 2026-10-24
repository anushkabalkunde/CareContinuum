/**
 * @license
 * CareContinuum - In-App Documentation & Storage Architecture Viewer
 * Provides complete architectural diagrams, database storage locations,
 * Netflix-style family joint account manual, APK build instructions,
 * and direct downloads for all documentation repository files.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Database, Smartphone, ShieldCheck, HelpCircle, Download, FileText, CheckCircle2, FolderCheck } from 'lucide-react';
import { PillButton } from './PillButton';

export const DocsViewerModal: React.FC = () => {
  const { isDocsModalOpen, setIsDocsModalOpen } = useApp();
  const [activeDocTab, setActiveDocTab] = useState<'files' | 'storage' | 'family' | 'apk' | 'architecture'>('files');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isDocsModalOpen) return null;

  const docFiles = [
    {
      name: 'Project_Report.docx',
      format: 'DOCX',
      size: '18 KB',
      description: 'Comprehensive Stanford d.school Design Thinking & Engineering Project Report',
      path: '/CareContinuum/documentation/Project_Report.docx'
    },
    {
      name: 'Software_Requirements.docx',
      format: 'DOCX',
      size: '14 KB',
      description: 'IEEE 830-1998 Software Requirements Specification (SRS) for App & IoT Box',
      path: '/CareContinuum/documentation/Software_Requirements.docx'
    },
    {
      name: 'System_Architecture.md',
      format: 'MD',
      size: '9 KB',
      description: '6-Tier System Architecture (User, Interface, Input, Processing, Data, Notification)',
      path: '/CareContinuum/documentation/System_Architecture.md'
    },
    {
      name: 'Database_Design.md',
      format: 'MD',
      size: '12 KB',
      description: 'Exact Database Storage Locations (SQLite, IndexedDB, Firestore) and Relational DDL',
      path: '/CareContinuum/documentation/Database_Design.md'
    },
    {
      name: 'Testing_Report.md',
      format: 'MD',
      size: '8 KB',
      description: 'Quality Assurance Matrix, 38 Test Cases, Unit & Integration Verifications',
      path: '/CareContinuum/documentation/Testing_Report.md'
    },
    {
      name: 'User_Manual.md',
      format: 'MD',
      size: '10 KB',
      description: 'End-User Operational Guide for Families, Caregivers, and Elderly Patients',
      path: '/CareContinuum/documentation/User_Manual.md'
    }
  ];

  const handleDownloadFullZip = () => {
    const link = document.createElement('a');
    link.href = '/CareContinuum_Full_Project.zip';
    link.download = 'CareContinuum_Full_Project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadNotice('Downloading complete project archive: CareContinuum_Full_Project.zip');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleDownloadFile = (fileName: string) => {
    // Check if user is requesting a docx or file directly from documentation
    if (fileName.endsWith('.docx')) {
      const link = document.createElement('a');
      link.href = `/CareContinuum/documentation/${fileName}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadNotice(`Downloaded ${fileName}!`);
      setTimeout(() => setDownloadNotice(null), 3000);
      return;
    }

    // Generate markdown download
    let content = `# ${fileName}\n\n`;
    if (fileName.includes('System_Architecture')) {
      content += `CareContinuum 6-Tier Architecture:\n1. User Layer (Elderly, New Parent, Remote Caregiver)\n2. Interface Layer (ESP32 Box + Mobile App)\n3. Input Layer (Barcode, OCR, Manual)\n4. Processing Layer (Duplicate Checker, Expiry Tracker, Stock Subtraction 20->19, Low Stock 4<5)\n5. Data Layer (SQLite /data/data/com.carecontinuum.app/databases/carecontinuum.db, Firestore)\n6. Notification Layer\n`;
    } else if (fileName.includes('Database_Design')) {
      content += `Storage Locations:\n- Android APK: /data/data/com.carecontinuum.app/databases/carecontinuum.db (SQLite)\n- Web Sandbox: IndexedDB key "carecontinuum_state_v1"\n- Cloud: Google Cloud Firestore under /households/{householdId}\n`;
    } else {
      content += `Full document saved in project repository at CareContinuum/documentation/${fileName}.\n`;
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(`Downloaded ${fileName}! Saved to your downloads.`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const downloadAllDocs = () => {
    handleDownloadFullZip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#EBF5F8] text-[#1E7B99] rounded-xl">
              <FolderCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">CareContinuum Project Package</h2>
              <p className="text-xs text-slate-500">All Code, Gradle, Documentation & Databases</p>
            </div>
          </div>
          <button
            onClick={() => setIsDocsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveDocTab('files')}
            className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeDocTab === 'files'
                ? 'border-[#1E7B99] text-[#1E7B99] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Files & ZIP Bundle</span>
          </button>
          <button
            onClick={() => setActiveDocTab('storage')}
            className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeDocTab === 'storage'
                ? 'border-[#1E7B99] text-[#1E7B99] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Storage</span>
          </button>
          <button
            onClick={() => setActiveDocTab('family')}
            className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeDocTab === 'family'
                ? 'border-[#1E7B99] text-[#1E7B99] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Netflix Family Mode</span>
          </button>
          <button
            onClick={() => setActiveDocTab('apk')}
            className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeDocTab === 'apk'
                ? 'border-[#1E7B99] text-[#1E7B99] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>APK Build Guide</span>
          </button>
        </div>

        {/* Document Body */}
        <div className="p-5 overflow-y-auto text-xs leading-relaxed space-y-4">
          {downloadNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{downloadNotice}</span>
            </div>
          )}

          {activeDocTab === 'files' && (
            <div className="space-y-3">
              {/* Prominent Full Project ZIP Download Box */}
              <div className="p-4 bg-gradient-to-r from-[#1E7B99] to-[#2EA3C7] rounded-2xl text-white shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold opacity-80">
                    Complete Archive
                  </div>
                  <h3 className="text-sm font-bold mt-0.5">CareContinuum_Full_Project.zip</h3>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Includes all source code, Gradle build files, JSON, manifests, and documentation folder.
                  </p>
                </div>
                <button
                  onClick={handleDownloadFullZip}
                  className="px-3.5 py-2 bg-white text-[#1E7B99] font-bold rounded-xl text-xs shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 flex-shrink-0 ml-3"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ZIP</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-sm text-slate-900">
                  Folder: CareContinuum/documentation/
                </span>
                <span className="text-[11px] text-slate-500">Individual Files</span>
              </div>

              <div className="space-y-2">
                {docFiles.map((file) => (
                  <div
                    key={file.name}
                    className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-[#1E7B99] transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          file.format === 'DOCX' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {file.format}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">{file.name}</span>
                        <span className="text-[10px] text-slate-400">({file.size})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{file.description}</p>
                    </div>

                    <button
                      onClick={() => handleDownloadFile(file.name)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-[#EBF5F8] text-[#1E7B99] transition-colors flex-shrink-0"
                      title={`Download ${file.name}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                <strong>Project Directory Tree:</strong>
                <div className="font-mono mt-1 text-[10px] text-slate-800 bg-white p-2 rounded border">
                  CareContinuum/<br />
                  ├── app source code/ (TypeScript, React, Tailwind, App.tsx, Context)<br />
                  ├── gradle/wrapper/gradle-wrapper.properties<br />
                  ├── app/build.gradle.kts & AndroidManifest.xml<br />
                  ├── build.gradle.kts<br />
                  ├── settings.gradle.kts<br />
                  ├── README.md<br />
                  └── documentation/<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── Project_Report.docx<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── Software_Requirements.docx<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── System_Architecture.md<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── Database_Design.md<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── Testing_Report.md<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;└── User_Manual.md
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'storage' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#1E7B99]" />
                Where Databases Are Stored
              </h3>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-800">1. Local Device Database (Android APK & Offline)</div>
                <p className="text-slate-600">
                  When deployed as a native Android APK or offline PWA:
                </p>
                <div className="font-mono bg-slate-900 text-emerald-400 p-2 rounded-lg text-[11px] overflow-x-auto">
                  /data/data/com.carecontinuum.app/databases/carecontinuum.db
                </div>
                <p className="text-slate-600">
                  In Web & browser mode, data resides in the sandboxed HTML5 LocalStorage & IndexedDB key: 
                  <code className="bg-slate-200 px-1 py-0.5 rounded text-[#1E7B99] ml-1">carecontinuum_state_v1</code>.
                </p>
              </div>

              <div className="p-3 bg-[#EBF5F8] border border-[#BDE0EA] rounded-xl space-y-2">
                <div className="font-bold text-[#155E75]">2. Cloud Synchronization Database (Firestore / PostgreSQL)</div>
                <p className="text-slate-700">
                  Shared across family members and the ESP32 physical Smart Medicine Box under collection:
                </p>
                <div className="font-mono bg-white text-[#155E75] p-2 rounded-lg text-[10px] border border-[#BDE0EA]">
                  /households/{'{householdId}'}/medicines<br />
                  /households/{'{householdId}'}/routines<br />
                  /households/{'{householdId}'}/dose_logs<br />
                  /households/{'{householdId}'}/members
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'family' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1E7B99]" />
                Netflix-Style Family Joint Account System
              </h3>
              <p className="text-slate-600">
                Similar to how Netflix allows multiple household members to share a single subscription with their own profiles:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 border rounded-xl">
                  <div className="font-bold text-slate-800">Shared Physical Box</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">One CareContinuum Box (CC-1042) connects to the whole household.</div>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-xl">
                  <div className="font-bold text-slate-800">1-Tap Profile Switch</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Switch between Alex, Sam, Riley or joint &quot;Everyone&quot; view in seconds.</div>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-xl">
                  <div className="font-bold text-slate-800">No Login for Dependents</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Kids and grandparents don&apos;t need smartphones; caregivers manage their doses.</div>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-xl">
                  <div className="font-bold text-slate-800">Admin Approval</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Invite codes (e.g. CC-4826) require Admin review before shared box access is granted.</div>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'apk' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#1E7B99]" />
                Android APK Build Instructions
              </h3>
              <p className="text-slate-600">
                To build the installable <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.apk</code> file for Android phones:
              </p>
              
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
                <div className="text-emerald-400"># Step 1: Initialize Capacitor in app root</div>
                <div>npx @capacitor/cli init CareContinuum com.carecontinuum.app --web-dir dist</div>
                <div className="text-emerald-400 mt-2"># Step 2: Build production assets</div>
                <div>npm run build</div>
                <div className="text-emerald-400 mt-2"># Step 3: Add Android platform</div>
                <div>npx cap add android</div>
                <div className="text-emerald-400 mt-2"># Step 4: Open in Android Studio & compile APK</div>
                <div>npx cap open android</div>
              </div>

              <p className="text-slate-600">
                In Android Studio, click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>. The APK will be ready at:
                <br />
                <code className="text-slate-800 font-mono font-semibold">android/app/build/outputs/apk/debug/app-debug.apk</code>
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <PillButton
            variant="secondary"
            size="sm"
            onClick={handleDownloadFullZip}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Project ZIP</span>
          </PillButton>
          <PillButton
            variant="primary"
            size="sm"
            onClick={() => setIsDocsModalOpen(false)}
          >
            Done
          </PillButton>
        </div>
      </div>
    </div>
  );
};

