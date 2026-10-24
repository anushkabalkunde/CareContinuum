/**
 * @license
 * CareContinuum - Doctor Adherence Report Export Service
 * Generates formatted clinical summary reports for physicians and caregivers
 */

import { CurrentUser, Household, Medicine, Routine, DoseLog } from '../types';

export interface DoctorReportData {
  user: CurrentUser;
  household: Household | null;
  medicines: Medicine[];
  routines: Routine[];
  doseLogs: DoseLog[];
  adherenceRate: number;
  reportDate: string;
}

export function generateDoctorReportHtml(data: DoctorReportData): string {
  const { user, household, medicines, routines, doseLogs, adherenceRate, reportDate } = data;

  const takenCount = doseLogs.filter(d => d.status === 'Taken').length;
  const missedCount = doseLogs.filter(d => d.status === 'Missed').length;
  const totalLogged = takenCount + missedCount;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CareContinuum - Patient Medication Adherence Report</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #1E7B99;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand {
      color: #1E7B99;
      font-size: 24px;
      font-weight: bold;
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-ok { background: #dcfce7; color: #166534; }
    .badge-missed { background: #fee2e2; color: #991b1b; }
    .section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 600;
    }
    .disclaimer {
      font-size: 11px;
      color: #64748b;
      margin-top: 32px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">CareContinuum</div>
      <div class="title">Clinical Adherence & Inventory Summary</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">
      <div>Generated: ${reportDate}</div>
      <div>Box Companion: CC-1042</div>
    </div>
  </div>

  <div class="section grid">
    <div class="card">
      <div style="font-size: 12px; color: #64748b;">Patient / Household Account</div>
      <div style="font-size: 16px; font-weight: bold;">${user.name}</div>
      <div style="font-size: 13px; color: #475569;">Household: ${household ? household.name : 'Individual Account'}</div>
      <div style="font-size: 13px; color: #475569;">Emergency Contact: ${user.emergencyInfo.emergencyContactName} (${user.emergencyInfo.emergencyContactPhone})</div>
    </div>
    <div class="card">
      <div style="font-size: 12px; color: #64748b;">Medical Adherence Rate</div>
      <div style="font-size: 24px; font-weight: bold; color: #1E7B99;">${adherenceRate}%</div>
      <div style="font-size: 13px; color: #475569;">${takenCount} of ${totalLogged || 1} doses taken · ${missedCount} missed</div>
      <div style="font-size: 13px; color: #dc2626; font-weight: 500;">Allergies: ${user.emergencyInfo.allergies || 'None reported'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Current Prescribed Medicines & Inventory</div>
    <table>
      <thead>
        <tr>
          <th>Medicine</th>
          <th>Strength & Form</th>
          <th>Purpose</th>
          <th>Current Stock</th>
          <th>Expiry Date</th>
        </tr>
      </thead>
      <tbody>
        ${medicines.map(m => `
          <tr>
            <td><strong>${m.name}</strong></td>
            <td>${m.strength} (${m.form})</td>
            <td>${m.purpose}</td>
            <td>${m.quantityInStock} ${m.quantityUnit}</td>
            <td>${m.expiryDate}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Active Care Routines</div>
    <table>
      <thead>
        <tr>
          <th>Routine Title</th>
          <th>Medicine</th>
          <th>Type</th>
          <th>Dose & Schedule</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${routines.map(r => `
          <tr>
            <td><strong>${r.title}</strong></td>
            <td>${r.medicineName} ${r.medicineStrength}</td>
            <td>${r.type === 'short-term' ? `Short-term (${r.durationDays} days)` : 'Chronic / Ongoing'}</td>
            <td>${r.doseAmount} ${r.doseUnit} at ${r.scheduleTimes.join(', ')}</td>
            <td>${r.active ? 'Active' : 'Completed'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Recent Adherence Dose Log</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Medicine</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${doseLogs.slice(0, 10).map(l => `
          <tr>
            <td>${l.date}</td>
            <td>${l.scheduledTime}</td>
            <td>${l.medicineName} ${l.medicineStrength}</td>
            <td>
              <span class="badge ${l.status === 'Taken' ? 'badge-ok' : 'badge-missed'}">
                ${l.status}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="disclaimer">
    <strong>Notice:</strong> This report is compiled from patient-logged data and the CareContinuum Smart Medicine Aid Box. <em>Not medical advice.</em> Doses and schedules must be verified by a licensed healthcare practitioner.
  </div>
</body>
</html>
  `;
}

export function downloadDoctorReport(data: DoctorReportData): void {
  const htmlContent = generateDoctorReportHtml(data);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create an iframe to print or a link to save
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    // If popups blocked, download file
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareContinuum_Doctor_Report_${data.user.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
