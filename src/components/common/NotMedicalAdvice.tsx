/**
 * @license
 * CareContinuum - NotMedicalAdvice disclaimer label
 * Reusable regulatory disclaimer mandated across clinical UI wireframes
 */

import React from 'react';

export const NotMedicalAdvice: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`text-[11px] text-slate-400 font-normal select-none ${className}`}>
      Not medical advice
    </div>
  );
};
