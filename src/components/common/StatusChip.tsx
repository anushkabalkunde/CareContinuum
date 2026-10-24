/**
 * @license
 * CareContinuum - StatusChip Component
 * Implements wireframe status badges: OK, Expiring soon, Expired, Low stock, Paired, etc.
 */

import React from 'react';
import { MedicineStatus } from '../../types';

interface StatusChipProps {
  status: MedicineStatus | 'Paired' | 'Offline' | 'Upcoming' | 'Missed' | 'Taken' | 'Pending' | string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, className = '' }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'OK':
    case 'Paired':
    case 'Taken':
      colorClasses = 'bg-[#E7F6F0] text-[#1B6A45] border-[#B4E5D1]';
      break;

    case 'Expiring soon':
    case 'Low stock':
    case 'Upcoming':
    case 'Pending':
    case 'Awaiting approval':
      colorClasses = 'bg-[#FFF6E5] text-[#A06800] border-[#FFE0A3]';
      break;

    case 'Expired':
    case 'Missed':
    case 'Offline':
      colorClasses = 'bg-[#FDE8E8] text-[#C53030] border-[#F8B4B4]';
      break;

    default:
      colorClasses = 'bg-[#F3F7F8] text-[#1E7B99] border-[#D0E7EE]';
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
};
