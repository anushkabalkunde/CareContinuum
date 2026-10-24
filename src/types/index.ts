/**
 * @license
 * CareContinuum - Smart Medicine Aid Box Companion
 * Domain Data Types & Interface Specifications
 */

export type UserRole = 'Admin' | 'Member' | 'Dependent';

export interface FamilyMember {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatarColor: string;
  avatarIcon?: string;
  isDependent?: boolean;
  notes?: string;
}

export interface Household {
  id: string;
  name: string;
  inviteCode: string; // e.g. "CC-4826"
  createdAt: string;
  adminId: string;
  members: FamilyMember[];
}

export interface JoinRequest {
  id: string;
  householdId: string;
  userName: string;
  userEmail: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type MedicineForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Inhaler' | 'Ointment';
export type MedicineStatus = 'OK' | 'Expiring soon' | 'Expired' | 'Low stock';

export interface Medicine {
  id: string;
  name: string;
  strength: string; // e.g. "500 mg"
  form: MedicineForm;
  purpose: string; // e.g. "Pain relief", "Fever relief"
  expiryDate: string; // ISO date string e.g. "2027-12-12"
  quantityInStock: number; // e.g. 24
  quantityUnit: string; // "tablets", "ml", "capsules"
  quantityThreshold: number; // default 5 (triggers Low stock when < threshold)
  assignedMemberId: string; // "all" or specific member ID e.g. "alex-1"
  storageInstructions?: string; // e.g. "Store in a cool, dry place"
  barcode?: string;
  createdAt: string;
  lastUpdated: string;
}

export type RoutineType = 'short-term' | 'chronic';

export interface Routine {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineStrength: string;
  title: string; // e.g. "Fever course", "Thyroid"
  type: RoutineType;
  memberId: string; // who this routine belongs to
  doseAmount: number; // e.g. 1
  doseUnit: string; // e.g. "tablet"
  timesPerDay: number; // e.g. 2
  scheduleTimes: string[]; // ["08:00 AM", "08:00 PM"]
  startDate: string; // ISO date string
  durationDays?: number; // for short-term courses, e.g. 5
  currentDay?: number; // e.g. 2 (for "Day 2 of 5")
  isOngoing?: boolean; // for chronic
  active: boolean;
}

export type DoseStatus = 'Taken' | 'Skipped' | 'Snoozed' | 'Missed' | 'Upcoming';

export interface DoseLog {
  id: string;
  routineId: string;
  medicineId: string;
  medicineName: string;
  medicineStrength: string;
  memberId: string;
  scheduledTime: string; // e.g. "8:00 AM"
  date: string; // YYYY-MM-DD
  status: DoseStatus;
  loggedAt?: string;
  notes?: string;
}

export type AlertType = 'dose_due' | 'missed_dose' | 'expiring_soon' | 'low_stock' | 'caregiver';

export interface CareAlert {
  id: string;
  type: AlertType;
  title: string;
  subtitle: string;
  medicineId?: string;
  routineId?: string;
  memberId?: string;
  memberName?: string;
  statusLabel: 'Upcoming' | 'Missed' | 'Expiring soon' | 'Low stock' | 'Caregiver Alert';
  timestamp: string;
  dismissed: boolean;
  priority: 'high' | 'medium' | 'normal';
}

export interface BoxStatus {
  id: string; // "CC-1042"
  name: string; // "CareContinuum Box · CC-1042"
  isPaired: boolean;
  isOnline: boolean;
  batteryPercentage: number; // e.g. 82
  cameraHealth: 'OK' | 'Pending' | 'Error';
  lastSynced: string; // e.g. "9:00 AM"
  firmwareVersion: string;
}

export interface EmergencyInfo {
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  doctorName?: string;
  doctorPhone?: string;
  bloodGroup?: string;
  specialNotes?: string;
}

export interface NotificationPreferences {
  doseReminders: boolean;
  missedDose: boolean;
  expiryWarnings: boolean;
  lowStock: boolean;
  caregiverAlerts: boolean;
  soundEnabled: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  mode: 'individual' | 'household';
  activeProfileId: string; // ID of active member selected (Netflix-style joint account profile)
  householdId?: string;
  notificationPreferences: NotificationPreferences;
  emergencyInfo: EmergencyInfo;
}
