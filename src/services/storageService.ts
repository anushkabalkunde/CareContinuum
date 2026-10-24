/**
 * @license
 * CareContinuum - Storage Service & Database Documentation
 * 
 * WHERE DATABASES ARE STORED:
 * 1. Client / Edge Database:
 *    - In Web / PWA / Android WebView: HTML5 LocalStorage & IndexedDB under the origin sandbox
 *      (key: 'carecontinuum_state_v1').
 *    - In Native Android APK (Capacitor/Flutter runtime): SQLite database file stored at:
 *      `/data/data/com.carecontinuum.app/databases/carecontinuum.db`
 * 2. Cloud Synchronization Database:
 *    - Cloud Firestore collection structure:
 *      /households/{householdId}/medicines/{medicineId}
 *      /households/{householdId}/routines/{routineId}
 *      /households/{householdId}/dose_logs/{logId}
 *      /households/{householdId}/members/{memberId}
 *      /households/{householdId}/join_requests/{requestId}
 *    - Allows multi-user real-time synchronization so changes made by an Admin (Alex)
 *      or Member (Sam) or Box IoT hardware instantly reflect on all phones.
 */

import {
  CurrentUser,
  Household,
  Medicine,
  Routine,
  DoseLog,
  CareAlert,
  BoxStatus,
  JoinRequest
} from '../types';

export interface AppStateData {
  user: CurrentUser | null;
  household: Household | null;
  medicines: Medicine[];
  routines: Routine[];
  doseLogs: DoseLog[];
  alerts: CareAlert[];
  boxStatus: BoxStatus;
  joinRequests: JoinRequest[];
  isDemoLoaded: boolean;
}

const STORAGE_KEY = 'carecontinuum_state_v1';

/**
 * Default initial seed data matching wireframe specifications exactly
 */
export const createInitialDemoState = (): AppStateData => {
  const adminMemberId = 'member-alex';
  const samMemberId = 'member-sam';
  const rileyMemberId = 'member-riley';

  const user: CurrentUser = {
    id: adminMemberId,
    name: 'Alex Demo',
    email: 'alex@example.com',
    mode: 'household',
    activeProfileId: 'all', // "all" for joint household view, or member ID
    householdId: 'hh-demo-4826',
    notificationPreferences: {
      doseReminders: true,
      missedDose: true,
      expiryWarnings: true,
      lowStock: true,
      caregiverAlerts: true,
      soundEnabled: true,
    },
    emergencyInfo: {
      allergies: 'Penicillin, Dust mites',
      emergencyContactName: 'Sam Demo',
      emergencyContactPhone: '+1 (555) 234-5678',
      doctorName: 'Dr. Sarah Patel',
      doctorPhone: '+1 (555) 876-5432',
      bloodGroup: 'O+',
      specialNotes: 'Elderly household member Riley has mild cognitive impairment. Double-check dosage.'
    }
  };

  const household: Household = {
    id: 'hh-demo-4826',
    name: 'Demo household',
    inviteCode: 'CC-4826',
    createdAt: '2026-10-01T08:00:00Z',
    adminId: adminMemberId,
    members: [
      {
        id: adminMemberId,
        name: 'Alex Demo',
        email: 'alex@example.com',
        role: 'Admin',
        avatarColor: '#1E7B99',
        avatarIcon: 'shield'
      },
      {
        id: samMemberId,
        name: 'Sam Demo',
        email: 'sam@example.com',
        role: 'Member',
        avatarColor: '#10B981',
        avatarIcon: 'user'
      },
      {
        id: rileyMemberId,
        name: 'Riley Demo',
        role: 'Dependent',
        avatarColor: '#F59E0B',
        avatarIcon: 'heart',
        isDependent: true,
        notes: 'Dependent · No login required'
      }
    ]
  };

  const medicines: Medicine[] = [
    {
      id: 'med-1',
      name: 'Paracetamol',
      strength: '500 mg',
      form: 'Tablet',
      purpose: 'Pain relief',
      expiryDate: '2027-12-12',
      quantityInStock: 24,
      quantityUnit: 'tablets',
      quantityThreshold: 5,
      assignedMemberId: adminMemberId, // For: Alex
      storageInstructions: 'Store in a cool, dry place',
      barcode: '8901234567890',
      createdAt: '2026-10-01T09:00:00Z',
      lastUpdated: '2026-10-14T09:00:00Z'
    },
    {
      id: 'med-2',
      name: 'Paracetamol',
      strength: '500 mg',
      form: 'Tablet',
      purpose: 'Fever relief',
      expiryDate: '2026-10-28', // Expiring in a few days
      quantityInStock: 12,
      quantityUnit: 'tablets',
      quantityThreshold: 5,
      assignedMemberId: samMemberId, // For: Sam
      storageInstructions: 'Store away from direct sunlight',
      barcode: '8901234567891',
      createdAt: '2026-09-15T09:00:00Z',
      lastUpdated: '2026-10-14T09:00:00Z'
    },
    {
      id: 'med-3',
      name: 'Paracetamol',
      strength: '500 mg',
      form: 'Tablet',
      purpose: 'Pain relief',
      expiryDate: '2026-09-30', // Already expired!
      quantityInStock: 8,
      quantityUnit: 'tablets',
      quantityThreshold: 5,
      assignedMemberId: adminMemberId, // For: Alex
      storageInstructions: 'Expired — do not use. Ask a pharmacist about safe disposal.',
      barcode: '8901234567892',
      createdAt: '2026-08-01T09:00:00Z',
      lastUpdated: '2026-10-14T09:00:00Z'
    },
    {
      id: 'med-4',
      name: 'Paracetamol',
      strength: '500 mg',
      form: 'Tablet',
      purpose: 'Fever relief',
      expiryDate: '2027-06-14',
      quantityInStock: 3, // Low stock: 3 < 5!
      quantityUnit: 'tablets',
      quantityThreshold: 5,
      assignedMemberId: samMemberId, // For: Sam
      storageInstructions: 'Store below 25°C',
      barcode: '8901234567893',
      createdAt: '2026-09-01T09:00:00Z',
      lastUpdated: '2026-10-14T09:00:00Z'
    }
  ];

  const routines: Routine[] = [
    {
      id: 'routine-1',
      medicineId: 'med-1',
      medicineName: 'Paracetamol',
      medicineStrength: '500 mg',
      title: 'Fever course',
      type: 'short-term',
      memberId: adminMemberId,
      doseAmount: 1,
      doseUnit: 'tablet',
      timesPerDay: 2,
      scheduleTimes: ['08:00 AM', '12:00 PM', '08:00 PM'],
      startDate: '2026-10-13',
      durationDays: 5,
      currentDay: 2, // Day 2 of 5
      active: true
    },
    {
      id: 'routine-2',
      medicineId: 'med-1',
      medicineName: 'Levothyroxine',
      medicineStrength: '50 mcg',
      title: 'Thyroid',
      type: 'chronic',
      memberId: adminMemberId,
      doseAmount: 1,
      doseUnit: 'tablet',
      timesPerDay: 1,
      scheduleTimes: ['07:00 AM'],
      startDate: '2026-01-01',
      isOngoing: true,
      active: true
    }
  ];

  const doseLogs: DoseLog[] = [
    {
      id: 'log-1',
      routineId: 'routine-1',
      medicineId: 'med-1',
      medicineName: 'Paracetamol',
      medicineStrength: '500 mg',
      memberId: adminMemberId,
      scheduledTime: '8:00 AM',
      date: '2026-10-14',
      status: 'Taken',
      loggedAt: '2026-10-14T08:05:00Z'
    },
    {
      id: 'log-2',
      routineId: 'routine-1',
      medicineId: 'med-1',
      medicineName: 'Paracetamol',
      medicineStrength: '500 mg',
      memberId: adminMemberId,
      scheduledTime: '12:00 PM',
      date: '2026-10-14',
      status: 'Upcoming'
    },
    {
      id: 'log-3',
      routineId: 'routine-1',
      medicineId: 'med-1',
      medicineName: 'Paracetamol',
      medicineStrength: '500 mg',
      memberId: adminMemberId,
      scheduledTime: '8:00 PM',
      date: '2026-10-13',
      status: 'Missed',
      loggedAt: '2026-10-13T21:30:00Z'
    },
    {
      id: 'log-4',
      routineId: 'routine-1',
      medicineId: 'med-1',
      medicineName: 'Paracetamol',
      medicineStrength: '500 mg',
      memberId: adminMemberId,
      scheduledTime: '8:00 AM',
      date: '2026-10-13',
      status: 'Taken',
      loggedAt: '2026-10-13T08:10:00Z'
    },
    {
      id: 'log-5',
      routineId: 'routine-2',
      medicineId: 'med-1',
      medicineName: 'Levothyroxine',
      medicineStrength: '50 mcg',
      memberId: adminMemberId,
      scheduledTime: '7:00 AM',
      date: '2026-10-14',
      status: 'Taken',
      loggedAt: '2026-10-14T07:02:00Z'
    }
  ];

  const alerts: CareAlert[] = [
    {
      id: 'alert-1',
      type: 'dose_due',
      title: 'Dose due',
      subtitle: 'Paracetamol 500 mg · 12:00 PM · Fever course',
      medicineId: 'med-1',
      routineId: 'routine-1',
      memberId: adminMemberId,
      memberName: 'Alex',
      statusLabel: 'Upcoming',
      timestamp: '12:00 PM',
      dismissed: false,
      priority: 'high'
    },
    {
      id: 'alert-2',
      type: 'missed_dose',
      title: 'Missed dose',
      subtitle: 'Paracetamol 500 mg · 8:00 AM · Sample reminder',
      medicineId: 'med-1',
      routineId: 'routine-1',
      memberId: adminMemberId,
      memberName: 'Alex',
      statusLabel: 'Missed',
      timestamp: '8:00 AM',
      dismissed: false,
      priority: 'high'
    },
    {
      id: 'alert-3',
      type: 'expiring_soon',
      title: 'Expiring soon',
      subtitle: 'Paracetamol 500 mg · Expiry: 28 Oct 2026',
      medicineId: 'med-2',
      memberId: samMemberId,
      memberName: 'Sam',
      statusLabel: 'Expiring soon',
      timestamp: '28 Oct 2026',
      dismissed: false,
      priority: 'medium'
    },
    {
      id: 'alert-4',
      type: 'low_stock',
      title: 'Low stock',
      subtitle: 'Paracetamol 500 mg · 3 tablets remaining',
      medicineId: 'med-4',
      memberId: samMemberId,
      memberName: 'Sam',
      statusLabel: 'Low stock',
      timestamp: 'Just now',
      dismissed: false,
      priority: 'medium'
    }
  ];

  const boxStatus: BoxStatus = {
    id: 'CC-1042',
    name: 'CareContinuum Box · CC-1042',
    isPaired: true,
    isOnline: true,
    batteryPercentage: 82,
    cameraHealth: 'OK',
    lastSynced: '9:00 AM',
    firmwareVersion: 'v2.4.1-esp32'
  };

  const joinRequests: JoinRequest[] = [
    {
      id: 'req-jordan-1',
      householdId: 'hh-demo-4826',
      userName: 'Jordan Demo',
      userEmail: 'jordan@example.com',
      requestedAt: '2026-10-14T08:30:00Z',
      status: 'pending'
    }
  ];

  return {
    user,
    household,
    medicines,
    routines,
    doseLogs,
    alerts,
    boxStatus,
    joinRequests,
    isDemoLoaded: true
  };
};

/**
 * Storage manager class with local sync and database location inspection
 */
export const StorageManager = {
  getStoragePath(): string {
    return 'HTML5 LocalStorage & IndexedDB Sandbox ("carecontinuum_state_v1") / Native SQLite: /data/data/com.carecontinuum.app/databases/carecontinuum.db';
  },

  loadState(): AppStateData {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch (e) {
      console.warn('Storage read failed, initializing new state:', e);
    }
    // Return default demo state so app is immediately interactive with rich wireframe data
    const initial = createInitialDemoState();
    this.saveState(initial);
    return initial;
  },

  saveState(state: AppStateData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to storage:', e);
    }
  },

  clearState(): AppStateData {
    localStorage.removeItem(STORAGE_KEY);
    const emptyState: AppStateData = {
      user: null,
      household: null,
      medicines: [],
      routines: [],
      doseLogs: [],
      alerts: [],
      boxStatus: {
        id: 'CC-1042',
        name: 'CareContinuum Box · CC-1042',
        isPaired: false,
        isOnline: false,
        batteryPercentage: 82,
        cameraHealth: 'Pending',
        lastSynced: 'Never',
        firmwareVersion: 'v2.4.1-esp32'
      },
      joinRequests: [],
      isDemoLoaded: false
    };
    this.saveState(emptyState);
    return emptyState;
  }
};
