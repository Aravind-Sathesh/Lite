'use client';

import type React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = '',
}: GlassCardProps) {
  return (
    <div
      className={`bg-neutral-900 border border-neutral-800 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
