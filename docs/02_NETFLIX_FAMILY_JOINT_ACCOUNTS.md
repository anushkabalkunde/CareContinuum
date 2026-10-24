# CareContinuum - Netflix-Style Family Joint Account System

## Why a Netflix-Style Joint Account for Medicines?
In a typical family home, several individuals share a single physical medicine box (CareContinuum Box CC-1042):
- Parents manage medications for themselves and their young children.
- Adult children manage medications for elderly parents or grandparents.
- Having to log out and sign in with separate credentials for each person is frustrating, prone to error, and causes missed doses.

Just like Netflix allows a single household account with individual viewer profiles, CareContinuum provides a **Family Joint Account** with multi-profile care management.

---

## Key Features of the Family Joint Account

### 1. One Shared Medicine Box, Multiple Profiles
- One hardware box (e.g. `CareContinuum Box · CC-1042`) is paired to the household.
- All medicines kept inside the box belong to the shared household inventory.
- Each medicine can either be marked for **"Everyone"** (e.g. common paracetamol or band-aids) or assigned to a specific individual (e.g. "For: Alex", "For: Sam").

### 2. Three Distinct Roles
1. **Admin (e.g. Alex Demo)**:
   - Sets up the household and pairs the physical medicine box.
   - Generates the household invite code (e.g. `CC-4826`).
   - Receives join requests and can **Approve** or **Reject** new members.
   - Configures emergency contact info, allergies, and notifications.
2. **Member (e.g. Sam Demo)**:
   - Joins via invite code with admin approval.
   - Has full access to log their own doses, scan new medicines, and see household inventory.
3. **Dependent (e.g. Riley Demo - Children / Seniors)**:
   - **No login or smartphone required!**
   - The Admin or Member creates the Dependent profile directly (e.g., "Riley Demo · Dependent").
   - Any family member can switch to Riley's profile to administer medicine and confirm doses on their behalf.

### 3. Instant 1-Tap Profile Switcher
- Tapping the avatar badge in the top header or opening the Profile Switcher displays the Netflix-style profile grid:
  - 🏠 **Everyone (Joint View)**: Shows combined inventory, today's schedule for all members, and household alerts.
  - 👤 **Alex Demo (Admin)**: Shows Alex's specific courses and reminders.
  - 👤 **Sam Demo (Member)**: Shows Sam's routines and assigned medications.
  - 💛 **Riley Demo (Dependent)**: Shows Riley's pediatric or geriatric dosages.
  - ➕ **Add Dependent Profile**: Fast form to register children or elders without requiring an email address.

### 4. Duplicate Purchase Protection Across Family
- When family member Sam is at the pharmacy and scans or enters "Paracetamol 500 mg", the system inspects the shared household inventory:
  ```
  "Already in stock — DON'T BUY. You have 18 tablets at home."
  ```
- This stops multiple family members from buying duplicate medicines simultaneously, saving money and reducing waste.
