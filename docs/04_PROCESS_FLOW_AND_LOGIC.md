# CareContinuum - Process Flow & Business Logic Specification

This document details the exact algorithms and process flows implemented from the Smart Medicine Aid Box process flow diagram.

---

## 1. Adding Medicine Flow & Input Modes
A user can add a medicine through three channels:
1. **Barcode Scan**: Scans standard 1D/2D barcodes (e.g. `8901234567890`), looks up medication name, strength, and form. User provides quantity and expiry date.
2. **OCR Camera**: Camera takes a snapshot of the packaging label, parses medicine name and expiry date. User confirms or edits values.
3. **Manual Entry**: User fills all fields: Name, Strength, Form, Purpose, Expiry Date, Quantity with units, and Threshold.

All input sources are routed through the **Medicine Logging Module**.

---

## 2. Duplicate Purchase Checker
- **Trigger**: When adding or scanning a new medicine batch before saving to the box.
- **Algorithm**:
  1. Cleans and normalizes `name` (lowercase, trimmed) and `strength`.
  2. Queries household inventory for any matching records.
  3. If found:
     - Calculates total quantity currently at home.
     - Displays the alert banner:
       ```
       "Already in stock — DON'T BUY. You have 18 tablets at home."
       ```
     - User has two choices:
       * **Cancel**: Prevents duplicate buy.
       * **Restock**: Adds the quantity to inventory.

---

## 3. Expiry Tracker Logic
Medicine status is evaluated using reference date `DateTime.now()`:
- **Expired** (`#FDE8E8` / Red chip):
  * Trigger: `expiryDate < today`
  * UI: Shows red warning banner: *"Expired — do not use. Ask a pharmacist about safe disposal."*
- **Expiring Soon** (`#FFF6E5` / Amber chip):
  * Trigger: `0 <= (expiryDate - today) <= 30 days`
  * UI: Shows in the "Expiring soon" home counter and alerts screen.
- **OK** (`#E7F6F0` / Mint Green chip):
  * Trigger: `expiryDate > 30 days ahead` and `quantityInStock >= threshold`.

---

## 4. Quantity Tracker & Automatic Stock Subtraction
- When a medication reminder fires, the user is presented with three options:
  1. **Taken**:
     - Automatically logs a `Taken` entry in the `DoseLog` table with timestamp.
     - Automatically decrements the medicine inventory by 1 unit (e.g., 20 tablets &rarr; 19 tablets).
     - If the remaining stock drops below `quantityThreshold` (default: 5), it immediately fires a **Low Stock Alert**:
       ```
       "Only 4 left!"
       ```
     - Triggers celebratory positive habit confetti animation.
  2. **Skipped**:
     - Logs `Skipped` in the `DoseLog`.
     - Stock is **NOT** decremented.
  3. **Snooze**:
     - Reschedules the reminder alert by +10 minutes.
     - Stock is **NOT** decremented.

---

## 5. Doctor Clinical Summary Export
- Gathers the patient's:
  - Adherence compliance percentage (e.g. 80%).
  - Total taken vs missed doses.
  - Current active medications and strengths.
  - Linked active courses and chronic regimens.
  - Allergies and emergency contacts.
- Generates a clinical summary report printable directly to PDF or paper for physician review.
