'use client';

import type React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function GlassCard({
  children,
  className = '',
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`bg-[#1c1c1c] border border-neutral-800 rounded-2xl ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </div>
  );
}
