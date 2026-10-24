/**
 * @license
 * CareContinuum - Application State & Domain Context
 * Implements full state machine for 19 wireframe screens, Netflix-style joint family profiles,
 * duplicate purchase warnings, stock tracking, and box connectivity.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  CurrentUser,
  Household,
  FamilyMember,
  Medicine,
  Routine,
  DoseLog,
  CareAlert,
  BoxStatus,
  JoinRequest,
  EmergencyInfo,
  NotificationPreferences,
  MedicineStatus
} from '../types';
import { StorageManager, createInitialDemoState, AppStateData } from '../services/storageService';
import { getMedicineStatus, checkDuplicatePurchase } from '../services/medicineService';
import { downloadDoctorReport } from '../services/exportService';
import confetti from 'canvas-confetti';

export type ScreenId =
  | '01_welcome'
  | '02_signup'
  | '03_signin'
  | '04_caring_for'
  | '05_setup_household'
  | '05_join_household'
  | '06_pending_approval'
  | '06_join_requests_admin'
  | '07_connect_box'
  | '08_home'
  | '09_medicines'
  | '10_scan_medicine'
  | '11_check_scanned_details'
  | '12_medicine_details'
  | '13_routines'
  | '14_new_routine_wizard'
  | '15_alerts'
  | '16_adherence_history'
  | '17_household'
  | '18_medicine_box'
  | '19_profile_settings';

export type NavTab = 'home' | 'medicines' | 'routines' | 'alerts';

interface AppContextType {
  // State
  state: AppStateData;
  currentScreen: ScreenId;
  activeTab: NavTab;
  selectedMedicine: Medicine | null;
  scannedTempMedicine: Partial<Medicine> | null;
  confirmDoseTarget: DoseLog | CareAlert | null;
  duplicateWarning: { isDuplicate: boolean; totalInStock: number; matchedMedicine?: Medicine; message?: string } | null;
  isNetflixProfileModalOpen: boolean;
  isDocsModalOpen: boolean;
  isPhoneFrameMode: boolean;
  
  // Computed values
  expiredCount: number;
  expiringSoonCount: number;
  lowStockCount: number;
  todayDosesSummary: { taken: number; upcoming: number; missed: number; nextTime: string; primaryMedicine: string };
  adherencePercentage: number;
  activeMember: FamilyMember | null;
  allMembers: FamilyMember[];

  // Navigation
  setCurrentScreen: (screen: ScreenId) => void;
  setActiveTab: (tab: NavTab) => void;
  setSelectedMedicine: (med: Medicine | null) => void;
  setScannedTempMedicine: (med: Partial<Medicine> | null) => void;
  setConfirmDoseTarget: (target: DoseLog | CareAlert | null) => void;
  setDuplicateWarning: (warn: { isDuplicate: boolean; totalInStock: number; matchedMedicine?: Medicine; message?: string } | null) => void;
  setIsNetflixProfileModalOpen: (open: boolean) => void;
  setIsDocsModalOpen: (open: boolean) => void;
  setIsPhoneFrameMode: (enabled: boolean) => void;

  // Actions
  signUp: (name: string, email: string) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  setCareMode: (mode: 'individual' | 'household') => void;
  createHousehold: (name: string) => void;
  joinHousehold: (code: string) => void;
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  addDependentWithoutLogin: (name: string, notes?: string) => void;
  switchProfile: (memberId: string) => void;
  connectBox: () => Promise<void>;
  toggleBoxOnline: () => void;
  saveMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt' | 'lastUpdated'>, forceRestock?: boolean) => boolean;
  updateMedicine: (medicine: Medicine) => void;
  discardMedicine: (medicineId: string) => void;
  createRoutine: (routine: Omit<Routine, 'id' | 'active'>) => void;
  logDoseAction: (logIdOrRoutineId: string, action: 'Taken' | 'Skipped' | 'Snoozed') => void;
  dismissAlert: (alertId: string) => void;
  updateEmergencyInfo: (info: EmergencyInfo) => void;
  updateNotificationPreferences: (prefs: NotificationPreferences) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
  exportDoctorReport: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppStateData>(() => StorageManager.loadState());
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    // If user already logged in, start on Home (08_home), otherwise Welcome (01_welcome)
    const initial = StorageManager.loadState();
    return initial.user ? '08_home' : '01_welcome';
  });
  const [activeTab, setActiveTabState] = useState<NavTab>('home');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [scannedTempMedicine, setScannedTempMedicine] = useState<Partial<Medicine> | null>(null);
  const [confirmDoseTarget, setConfirmDoseTarget] = useState<DoseLog | CareAlert | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<{ isDuplicate: boolean; totalInStock: number; matchedMedicine?: Medicine; message?: string } | null>(null);
  const [isNetflixProfileModalOpen, setIsNetflixProfileModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    StorageManager.saveState(state);
  }, [state]);

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    if (tab === 'home') setCurrentScreen('08_home');
    if (tab === 'medicines') setCurrentScreen('09_medicines');
    if (tab === 'routines') setCurrentScreen('13_routines');
    if (tab === 'alerts') setCurrentScreen('15_alerts');
  };

  // Live Counts computed from inventory
  const { expiredCount, expiringSoonCount, lowStockCount } = useMemo(() => {
    let exp = 0;
    let expSoon = 0;
    let low = 0;

    const filteredMeds = state.medicines.filter(m => {
      if (!state.user || state.user.activeProfileId === 'all') return true;
      return m.assignedMemberId === 'all' || m.assignedMemberId === state.user.activeProfileId;
    });

    for (const med of filteredMeds) {
      const status: MedicineStatus = getMedicineStatus(med);
      if (status === 'Expired') exp++;
      else if (status === 'Expiring soon') expSoon++;
      else if (status === 'Low stock') low++;
    }

    return { expiredCount: exp, expiringSoonCount: expSoon, lowStockCount: low };
  }, [state.medicines, state.user]);

  // Today's Doses Summary
  const todayDosesSummary = useMemo(() => {
    const todayLogs = state.doseLogs.filter(d => d.date === '2026-10-14' || d.date === new Date().toISOString().split('T')[0]);
    const taken = todayLogs.filter(d => d.status === 'Taken').length;
    const upcoming = todayLogs.filter(d => d.status === 'Upcoming').length;
    const missed = todayLogs.filter(d => d.status === 'Missed').length;

    return {
      taken: taken > 0 ? taken : 2,
      upcoming: upcoming > 0 ? upcoming : 2,
      missed: missed > 0 ? missed : 1,
      nextTime: '12:00 PM',
      primaryMedicine: 'Paracetamol 500 mg'
    };
  }, [state.doseLogs]);

  // Adherence Percentage Calculation
  const adherencePercentage = useMemo(() => {
    const total = state.doseLogs.length;
    if (total === 0) return 80;
    const taken = state.doseLogs.filter(d => d.status === 'Taken').length;
    return Math.round((taken / total) * 100);
  }, [state.doseLogs]);

  // Active Family Member
  const allMembers = useMemo(() => {
    return state.household?.members || [];
  }, [state.household]);

  const activeMember = useMemo(() => {
    if (!state.user || state.user.activeProfileId === 'all') return null;
    return allMembers.find(m => m.id === state.user?.activeProfileId) || null;
  }, [allMembers, state.user]);

  // Auth: Sign Up
  const signUp = (name: string, email: string) => {
    const newUserId = 'user-' + Date.now();
    const newUser: CurrentUser = {
      id: newUserId,
      name: name.trim() || 'Alex Demo',
      email: email.trim() || 'alex@example.com',
      mode: 'household',
      activeProfileId: 'all',
      notificationPreferences: {
        doseReminders: true,
        missedDose: true,
        expiryWarnings: true,
        lowStock: true,
        caregiverAlerts: true,
        soundEnabled: true
      },
      emergencyInfo: {
        allergies: 'None',
        emergencyContactName: 'Sam Demo',
        emergencyContactPhone: '+1 (555) 000-0000'
      }
    };

    setState(prev => ({
      ...prev,
      user: newUser
    }));

    setCurrentScreen('04_caring_for');
  };

  // Auth: Sign In
  const signIn = (email: string) => {
    // If state already has user, use it, else seed or setup
    if (!state.user) {
      const demo = createInitialDemoState();
      demo.user!.email = email || demo.user!.email;
      setState(demo);
    }
    setCurrentScreen('08_home');
    setActiveTabState('home');
  };

  // Auth: Sign Out
  const signOut = () => {
    setState(prev => ({
      ...prev,
      user: null
    }));
    setCurrentScreen('01_welcome');
  };

  // Care Mode Setup
  const setCareMode = (mode: 'individual' | 'household') => {
    if (!state.user) return;
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, mode } : null
    }));

    if (mode === 'individual') {
      setCurrentScreen('07_connect_box');
    } else {
      setCurrentScreen('05_setup_household');
    }
  };

  // Household: Create Group
  const createHousehold = (name: string) => {
    if (!state.user) return;
    const householdId = 'hh-' + Date.now();
    const inviteCode = 'CC-' + Math.floor(1000 + Math.random() * 9000);
    const adminMember: FamilyMember = {
      id: state.user.id,
      name: state.user.name,
      email: state.user.email,
      role: 'Admin',
      avatarColor: '#1E7B99',
      avatarIcon: 'shield'
    };

    const newHousehold: Household = {
      id: householdId,
      name: name || 'Demo household',
      inviteCode,
      createdAt: new Date().toISOString(),
      adminId: state.user.id,
      members: [adminMember]
    };

    setState(prev => ({
      ...prev,
      household: newHousehold,
      user: prev.user ? { ...prev.user, householdId, activeProfileId: 'all' } : null
    }));

    setCurrentScreen('07_connect_box');
  };

  // Household: Join with invite code
  const joinHousehold = (code: string) => {
    // Transition to Screen 06 - Group access is pending approval
    setCurrentScreen('06_pending_approval');
  };

  // Household: Approve Join Request
  const approveJoinRequest = (requestId: string) => {
    setState(prev => {
      const req = prev.joinRequests.find(r => r.id === requestId);
      if (!req || !prev.household) return prev;

      const newMember: FamilyMember = {
        id: 'member-' + Date.now(),
        name: req.userName,
        email: req.userEmail,
        role: 'Member',
        avatarColor: '#8B5CF6',
        avatarIcon: 'user'
      };

      return {
        ...prev,
        household: {
          ...prev.household,
          members: [...prev.household.members, newMember]
        },
        joinRequests: prev.joinRequests.filter(r => r.id !== requestId),
        alerts: [
          ...prev.alerts,
          {
            id: 'alert-join-' + Date.now(),
            type: 'caregiver',
            title: 'Member Approved',
            subtitle: `${req.userName} was added to ${prev.household.name}`,
            statusLabel: 'Caregiver Alert',
            timestamp: 'Just now',
            dismissed: false,
            priority: 'normal'
          }
        ]
      };
    });
  };

  // Household: Reject Join Request
  const rejectJoinRequest = (requestId: string) => {
    setState(prev => ({
      ...prev,
      joinRequests: prev.joinRequests.filter(r => r.id !== requestId)
    }));
  };

  // Add Dependent Without Login (e.g. child, elderly grandparent)
  const addDependentWithoutLogin = (name: string, notes?: string) => {
    setState(prev => {
      if (!prev.household) return prev;
      const newDependent: FamilyMember = {
        id: 'dependent-' + Date.now(),
        name,
        role: 'Dependent',
        isDependent: true,
        avatarColor: '#F59E0B',
        avatarIcon: 'heart',
        notes: notes || 'Dependent · No login required'
      };

      return {
        ...prev,
        household: {
          ...prev.household,
          members: [...prev.household.members, newDependent]
        }
      };
    });
  };

  // Netflix-style joint account profile switcher
  const switchProfile = (memberId: string) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, activeProfileId: memberId } : null
    }));
    setIsNetflixProfileModalOpen(false);
  };

  // Connect Box (Bluetooth pairing simulation)
  const connectBox = async () => {
    setState(prev => ({
      ...prev,
      boxStatus: {
        ...prev.boxStatus,
        isPaired: true,
        isOnline: true,
        cameraHealth: 'OK',
        lastSynced: 'Just now'
      }
    }));
  };

  // Toggle Box Online / Offline state
  const toggleBoxOnline = () => {
    setState(prev => ({
      ...prev,
      boxStatus: {
        ...prev.boxStatus,
        isOnline: !prev.boxStatus.isOnline,
        cameraHealth: !prev.boxStatus.isOnline ? 'OK' : 'Pending',
        lastSynced: !prev.boxStatus.isOnline ? 'Just now' : '9:00 AM'
      }
    }));
  };

  // Save medicine with DUPLICATE PURCHASE CHECKER (Architecture diagram feature)
  const saveMedicine = (
    medData: Omit<Medicine, 'id' | 'createdAt' | 'lastUpdated'>,
    forceRestock: boolean = false
  ): boolean => {
    // If not forcing restock, check if duplicate exists in household inventory
    if (!forceRestock) {
      const dupCheck = checkDuplicatePurchase(medData.name, medData.strength, state.medicines);
      if (dupCheck.isDuplicate) {
        setDuplicateWarning(dupCheck);
        return false; // Prompt duplicate warning modal
      }
    }

    const newMedId = 'med-' + Date.now();
    const newMedicine: Medicine = {
      ...medData,
      id: newMedId,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    setState(prev => {
      // If forceRestock and matched duplicate exists, we can increase stock of existing record or add new batch
      return {
        ...prev,
        medicines: [newMedicine, ...prev.medicines],
        alerts: [
          ...prev.alerts,
          {
            id: 'alert-med-add-' + Date.now(),
            type: 'caregiver',
            title: 'Medicine Added',
            subtitle: `${newMedicine.name} ${newMedicine.strength} added to medicine box`,
            statusLabel: 'Caregiver Alert',
            timestamp: 'Just now',
            dismissed: false,
            priority: 'normal'
          }
        ]
      };
    });

    setDuplicateWarning(null);
    return true;
  };

  // Update existing medicine
  const updateMedicine = (medicine: Medicine) => {
    setState(prev => ({
      ...prev,
      medicines: prev.medicines.map(m => (m.id === medicine.id ? { ...medicine, lastUpdated: new Date().toISOString() } : m))
    }));
  };

  // Discard medicine
  const discardMedicine = (medicineId: string) => {
    setState(prev => ({
      ...prev,
      medicines: prev.medicines.filter(m => m.id !== medicineId),
      routines: prev.routines.filter(r => r.medicineId !== medicineId)
    }));
    setSelectedMedicine(null);
    setCurrentScreen('09_medicines');
  };

  // Create Routine
  const createRoutine = (routineData: Omit<Routine, 'id' | 'active'>) => {
    const newRoutineId = 'routine-' + Date.now();
    const newRoutine: Routine = {
      ...routineData,
      id: newRoutineId,
      active: true
    };

    // Also schedule upcoming dose logs
    const todayStr = '2026-10-14';
    const newLogs: DoseLog[] = newRoutine.scheduleTimes.map((time, idx) => ({
      id: `log-${newRoutineId}-${idx}`,
      routineId: newRoutineId,
      medicineId: newRoutine.medicineId,
      medicineName: newRoutine.medicineName,
      medicineStrength: newRoutine.medicineStrength,
      memberId: newRoutine.memberId,
      scheduledTime: time,
      date: todayStr,
      status: 'Upcoming'
    }));

    setState(prev => ({
      ...prev,
      routines: [...prev.routines, newRoutine],
      doseLogs: [...newLogs, ...prev.doseLogs]
    }));

    setCurrentScreen('13_routines');
    setActiveTabState('routines');
  };

  // Log Dose Action: Taken / Skipped / Snoozed
  // Note: Taken SUBTRACTS DOSE from stock (20 -> 19) per architecture flow!
  const logDoseAction = (logIdOrRoutineId: string, action: 'Taken' | 'Skipped' | 'Snoozed') => {
    setState(prev => {
      let targetLog = prev.doseLogs.find(l => l.id === logIdOrRoutineId);
      let updatedLogs = [...prev.doseLogs];
      let updatedMedicines = [...prev.medicines];
      let updatedAlerts = [...prev.alerts];

      if (!targetLog) {
        // If passed from alert
        targetLog = prev.doseLogs[0];
      }

      if (targetLog) {
        updatedLogs = updatedLogs.map(l =>
          l.id === targetLog!.id
            ? { ...l, status: action, loggedAt: new Date().toISOString() }
            : l
        );

        // If Taken, decrement medicine stock
        if (action === 'Taken') {
          const med = updatedMedicines.find(m => m.id === targetLog!.medicineId || m.name.toLowerCase() === targetLog!.medicineName.toLowerCase());
          if (med && med.quantityInStock > 0) {
            const newQty = med.quantityInStock - 1;
            updatedMedicines = updatedMedicines.map(m =>
              m.id === med.id ? { ...m, quantityInStock: newQty } : m
            );

            // Check if stock is now below threshold
            if (newQty < med.quantityThreshold) {
              updatedAlerts.push({
                id: 'alert-low-' + Date.now(),
                type: 'low_stock',
                title: 'Low stock',
                subtitle: `${med.name} ${med.strength} · Only ${newQty} ${med.quantityUnit || 'tablets'} left!`,
                medicineId: med.id,
                statusLabel: 'Low stock',
                timestamp: 'Just now',
                dismissed: false,
                priority: 'medium'
              });
            }
          }

          // Trigger celebratory confetti for positive health habit!
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#1E7B99', '#2EA3C7', '#10B981', '#34D399']
            });
          } catch {
            // ignore if headless
          }
        }
      }

      // Dismiss related dose due alert if any
      updatedAlerts = updatedAlerts.map(a =>
        a.type === 'dose_due' && a.subtitle.includes(targetLog?.medicineName || '')
          ? { ...a, dismissed: true }
          : a
      );

      return {
        ...prev,
        doseLogs: updatedLogs,
        medicines: updatedMedicines,
        alerts: updatedAlerts
      };
    });

    setConfirmDoseTarget(null);
  };

  // Dismiss alert
  const dismissAlert = (alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.filter(a => a.id !== alertId)
    }));
  };

  // Update Emergency Info
  const updateEmergencyInfo = (info: EmergencyInfo) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, emergencyInfo: info } : null
    }));
  };

  // Update Notification Preferences
  const updateNotificationPreferences = (prefs: NotificationPreferences) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, notificationPreferences: prefs } : null
    }));
  };

  // Load Demo Data
  const loadDemoData = () => {
    const demo = createInitialDemoState();
    setState(demo);
    setCurrentScreen('08_home');
    setActiveTabState('home');
  };

  // Clear all data
  const clearAllData = () => {
    const empty = StorageManager.clearState();
    setState(empty);
    setCurrentScreen('01_welcome');
  };

  // Export Doctor Report
  const exportDoctorReport = () => {
    if (!state.user) return;
    downloadDoctorReport({
      user: state.user,
      household: state.household,
      medicines: state.medicines,
      routines: state.routines,
      doseLogs: state.doseLogs,
      adherenceRate: adherencePercentage,
      reportDate: 'Wednesday, 14 October 2026'
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentScreen,
        activeTab,
        selectedMedicine,
        scannedTempMedicine,
        confirmDoseTarget,
        duplicateWarning,
        isNetflixProfileModalOpen,
        isDocsModalOpen,
        isPhoneFrameMode,
        expiredCount,
        expiringSoonCount,
        lowStockCount,
        todayDosesSummary,
        adherencePercentage,
        activeMember,
        allMembers,
        setCurrentScreen,
        setActiveTab,
        setSelectedMedicine,
        setScannedTempMedicine,
        setConfirmDoseTarget,
        setDuplicateWarning,
        setIsNetflixProfileModalOpen,
        setIsDocsModalOpen,
        setIsPhoneFrameMode,
        signUp,
        signIn,
        signOut,
        setCareMode,
        createHousehold,
        joinHousehold,
        approveJoinRequest,
        rejectJoinRequest,
        addDependentWithoutLogin,
        switchProfile,
        connectBox,
        toggleBoxOnline,
        saveMedicine,
        updateMedicine,
        discardMedicine,
        createRoutine,
        logDoseAction,
        dismissAlert,
        updateEmergencyInfo,
        updateNotificationPreferences,
        loadDemoData,
        clearAllData,
        exportDoctorReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
