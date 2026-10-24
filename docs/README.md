# CareContinuum - Smart Medicine Aid Box Companion

Welcome to **CareContinuum**, the companion application for the Smart Medicine Aid Box.

## Documentation Index
All requested technical and user documentation is saved in this `/docs/` folder:

1. [01_ARCHITECTURE_AND_DATABASE_STORAGE.md](./01_ARCHITECTURE_AND_DATABASE_STORAGE.md):
   - High-level system architecture (User, Interface, Input, Processing, Data, and Notification Layers)
   - Exact locations where databases are stored (Local SQLite path on Android: `/data/data/com.carecontinuum.app/databases/carecontinuum.db` vs Cloud Firestore schema).
2. [02_NETFLIX_FAMILY_JOINT_ACCOUNTS.md](./02_NETFLIX_FAMILY_JOINT_ACCOUNTS.md):
   - Joint family account architecture
   - Netflix-style multi-profile switcher (Alex Admin, Sam Member, Riley Dependent)
   - Admin approval flows and invite codes (`CC-4826`).
3. [03_ANDROID_APK_BUILD_AND_RELEASE_GUIDE.md](./03_ANDROID_APK_BUILD_AND_RELEASE_GUIDE.md):
   - Step-by-step commands to generate the installable Android `.apk` via Capacitor or TWA.
   - Required Android permissions and manifests.
4. [04_PROCESS_FLOW_AND_LOGIC.md](./04_PROCESS_FLOW_AND_LOGIC.md):
   - Duplicate purchase checker ("Already in stock - DON'T BUY. You have 18 tablets at home")
   - Expiry status rules (Expired vs Expiring soon <= 30 days vs OK)
   - Stock subtraction on dose confirmation (20 -> 19)
   - Low stock alerts (4 < 5 threshold).

## Key Wireframe Screen Coverage
- `01 / SETUP`: Welcome & intro
- `02 / SETUP`: Create account
- `03 / SETUP`: Sign in & password reset
- `04 / SETUP`: "Who are you caring for?" (Individual vs Household)
- `05 / SETUP`: Set up household & Join with invite code
- `06 / SETUP`: Pending approval & Admin request review
- `07 / SETUP`: Connect physical medicine box (Bluetooth LE pairing)
- `08 / HOME`: "Your day at a glance" dashboard with counters & offline states
- `09 / MEDICINES`: Inventory list with search and status chips
- `10 / MEDICINES`: Barcode/OCR scanner with live camera toggle and simulated recognition
- `11 / MEDICINES`: Check scanned details with household member assignment
- `12 / MEDICINES`: Medicine details, stock, linked routines, and discard flow
- `13 / ROUTINES`: Short-term courses and Chronic daily routines
- `14 / ROUTINES`: 3-step New Routine Wizard
- `15 / ALERTS`: Dose due, missed dose, expiring soon, low stock, and Confirm Dose modal
- `16 / ROUTINES`: Weekly adherence history & Doctor clinical export
- `17 / HOME`: Household management, invite code sharing, dependent registration
- `18 / HOME`: Medicine box status, battery, and offline simulator
- `19 / HOME`: Profile, notification toggles, allergy info, and demo data tools
