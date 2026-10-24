# CareContinuum - System Architecture & Database Storage Locations

## 1. System Architecture Overview
CareContinuum is designed according to the multi-tier Smart Medicine Aid Box System Architecture:

```
[ User Layer ]
  - Elderly Users: Simple high-contrast interface, passive audible & visual cues.
  - New Parents / Caregivers: Quick access to family medicines, safety verification.
  - Remote Caregivers: Remote inventory monitoring, joint accounts, adherence alerts.

[ Interface Layer ]
  - Physical Smart Box: ESP32 Microcontroller + Camera + Status LEDs + Buzzer.
  - Mobile App: Android APK / PWA with inventory, expiry alerts, joint accounts.

[ Input Layer ]
  - Barcode Scanner: Barcode -> Drug Database -> Auto-fills Name, Strength, Form.
  - OCR Camera: Packaging snapshot -> Text recognition -> Auto-fills Name, Expiry.
  - Manual Entry: Direct confirmation and editing of all medication fields.

[ Processing Layer ]
  - Medicine Logging Module: Validates input records before persistence.
  - Duplicate Purchase Checker: Checks household stock -> "Already in stock - DON'T BUY".
  - Expiry Tracker: Flags Expired (< today) and Expiring Soon (<= 30 days).
  - Quantity Tracker: Subtracts logged dose taken (e.g. 20 -> 19 tablets).
  - Low Stock Alert: Triggers caregiver warning when stock < threshold (e.g. 4 < 5).

[ Data Layer - Database Storage ]
  - Local SQLite / IndexedDB Database (Offline-first on device).
  - Cloud Synchronization Database (Firestore / PostgreSQL).

[ Notification Layer ]
  - Smartphone Push Notifications.
  - Caregiver Shared Household Alerts.
  - Physical Box LED & Buzzer reminders.
```

---

## 2. EXACT LOCATIONS WHERE DATABASES ARE STORED

### A. Local Edge Database (On the User's Phone / Android APK)
* **In Native Android APK (Built via Capacitor / Flutter)**:
  - Database Type: **SQLite 3 relational database**
  - Android Internal File System Path:
    ```
    /data/data/com.carecontinuum.app/databases/carecontinuum.db
    ```
  - Characteristics:
    - Encrypted in the Android application sandbox.
    - Accessible only by the CareContinuum process.
    - Persists permanently across device reboots and app updates.
    - Zero-latency query time, works 100% offline without cellular or Wi-Fi.

* **In Web / PWA / Android WebView Runtime**:
  - Storage Engines: **HTML5 LocalStorage & IndexedDB**
  - Storage Keys:
    - `carecontinuum_state_v1` (Active operational database snapshot)
    - `carecontinuum_offline_queue` (Pending offline medication logs)
  - Origin Sandbox: Sandboxed under the origin `com.carecontinuum.app`.

### B. Cloud Synchronization Database (Centralized Multi-User Sync)
* **Primary Cloud Engine: Google Cloud Firestore / Firebase**
  - Hierarchical NoSQL document store allowing real-time websockets synchronization.
  - **Collection Structure**:
    ```
    /households/{householdId}
       ├── inviteCode: "CC-4826"
       ├── name: "Demo household"
       ├── adminId: "user-alex"
       ├── createdAt: Timestamp
       │
       ├── /members/{memberId}
       │     ├── name: "Alex Demo" | "Sam Demo" | "Riley Demo"
       │     ├── role: "Admin" | "Member" | "Dependent"
       │     ├── avatarColor: "#1E7B99"
       │     └── isDependent: boolean
       │
       ├── /medicines/{medicineId}
       │     ├── name: "Paracetamol"
       │     ├── strength: "500 mg"
       │     ├── form: "Tablet"
       │     ├── purpose: "Pain relief"
       │     ├── expiryDate: "2027-12-12"
       │     ├── quantityInStock: 24
       │     ├── quantityUnit: "tablets"
       │     ├── quantityThreshold: 5
       │     └── assignedMemberId: "member-alex"
       │
       ├── /routines/{routineId}
       │     ├── title: "Fever course"
       │     ├── type: "short-term" | "chronic"
       │     ├── scheduleTimes: ["08:00 AM", "08:00 PM"]
       │     ├── durationDays: 5
       │     └── currentDay: 2
       │
       ├── /dose_logs/{logId}
       │     ├── date: "2026-10-14"
       │     ├── scheduledTime: "8:00 AM"
       │     ├── status: "Taken" | "Missed" | "Skipped" | "Snoozed"
       │     └── loggedAt: Timestamp
       │
       └── /join_requests/{requestId}
             ├── userName: "Jordan Demo"
             ├── userEmail: "jordan@example.com"
             └── status: "pending" | "approved" | "rejected"
    ```

* **Relational Cloud SQL Alternative (PostgreSQL)**:
  - If deploying to a relational database, the tables correspond to:
    `households`, `users`, `household_members`, `medicines`, `routines`, `dose_logs`, `alerts`.
