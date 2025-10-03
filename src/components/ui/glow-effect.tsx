"use client";

import React from 'react';

interface GlowEffectProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({ 
  children, 
  isActive = false, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg blur-xl animate-pulse"></div>
      )}
    </div>
  );
};

export default GlowEffect;