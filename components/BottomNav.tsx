'use client';

import { Calculator, BarChart3, Settings } from 'lucide-react';
import { useColor } from '@/contexts/ColorContext';

interface BottomNavProps {
  activeScreen: 'calculator' | 'summary' | 'settings';
  onScreenChange: (screen: 'calculator' | 'summary' | 'settings') => void;
}

export default function BottomNav({
  activeScreen,
  onScreenChange,
}: BottomNavProps) {
  const { accentColor } = useColor();

  const navItems = [
    { id: 'calculator', icon: Calculator, label: 'Calculate' },
    { id: 'summary', icon: BarChart3, label: 'Summary' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-40 mb-safe'>
      <div className='flex items-center justify-around w-72 h-16 rounded-full backdrop-blur-xl border border-white/10 bg-white/3 px-4'>
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() =>
              onScreenChange(id as 'calculator' | 'summary' | 'settings')
            }
            className='flex flex-col items-center justify-center gap-1 transition-colors font-sans'
          >
            <Icon
              size={24}
              style={{ color: activeScreen === id ? accentColor : '#a3a3a3' }}
            />
            <span
              className='text-xs font-medium'
              style={{ color: activeScreen === id ? accentColor : '#ffffff' }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
