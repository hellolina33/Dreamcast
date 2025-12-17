
import React from 'react';

import { playClick, playHover } from '../services/soundService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  onClick,
  onMouseEnter,
  ...props
}) => {

  // Base: Chunky, rounded, flex centered, no selection
  const baseStyles = "relative w-full py-4 rounded-[2rem] font-display font-bold text-lg tracking-wide transition-all duration-200 transform active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group select-none";

  const variants = {
    // 3D Gradient Purple (Main Action)
    primary: "bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-white shadow-[0_8px_0_rgb(76,29,149),0_15px_20px_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_rgb(76,29,149),0_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[8px] border-t border-white/20",

    // 3D Dark Blue (Secondary)
    secondary: "bg-night-800 text-dream-300 border border-white/10 hover:bg-night-700 shadow-[0_6px_0_rgb(15,23,42)] active:shadow-none active:translate-y-[6px]",

    // Glass (Floating)
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg",

    // Ghost (Text only)
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",

    // Danger
    danger: "bg-gradient-to-b from-red-500 to-red-700 text-white shadow-[0_8px_0_rgb(153,27,27)] active:translate-y-[8px] active:shadow-none"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled && !isLoading) playClick();
    if (onClick) onClick(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled && !isLoading) playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {/* Glossy shine on top */}
      {variant === 'primary' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-60 pointer-events-none" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Magie en cours...
          </>
        ) : children}
      </span>
    </button>
  );
};
