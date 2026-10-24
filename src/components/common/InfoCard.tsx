/**
 * @license
 * CareContinuum - InfoCard Component
 * Soft rounded container with #F3F7F8 background per wireframe aesthetic
 */

import React from 'react';

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'soft' | 'white' | 'warning' | 'alert';
  onClick?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  children,
  variant = 'soft',
  onClick,
  className = '',
  ...props
}) => {
  const variantStyles = {
    soft: 'bg-[#F3F7F8] border border-slate-200/60 text-slate-800',
    white: 'bg-white border border-slate-200/80 shadow-xs text-slate-800',
    warning: 'bg-[#FFF9EE] border border-[#FFE0A3] text-[#7C4A00]',
    alert: 'bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]'
  }[variant];

  const clickableStyles = onClick
    ? 'cursor-pointer active:scale-[0.99] transition-transform hover:border-slate-300'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 ${variantStyles} ${clickableStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
