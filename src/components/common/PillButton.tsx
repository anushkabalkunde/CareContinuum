/**
 * @license
 * CareContinuum - PillButton Component
 * Primary teal button and secondary outlined buttons matching wireframe layout
 */

import React from 'react';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'primary',
  fullWidth = true,
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] select-none cursor-pointer';

  const sizeClasses = {
    sm: 'py-2 px-4 text-xs rounded-xl',
    md: 'py-3.5 px-6 text-sm rounded-2xl',
    lg: 'py-4 px-8 text-base rounded-2xl'
  }[size];

  const variantClasses = {
    primary:
      'bg-[#1E7B99] hover:bg-[#16647D] text-white shadow-sm shadow-[#1E7B99]/20 font-semibold disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-medium disabled:text-slate-400 disabled:cursor-not-allowed',
    danger:
      'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 font-medium'
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
