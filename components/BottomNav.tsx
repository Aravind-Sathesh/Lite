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
      <div
        className='
          flex items-center justify-around w-72 h-16 px-4
          rounded-full
          border border-white/20
          /* The Liquid Glass Recipe: */
          backdrop-blur-lg
          backdrop-saturate-150
        '
      >
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeScreen === id;

          return (
            <button
              key={id}
              onClick={() =>
                onScreenChange(id as 'calculator' | 'summary' | 'settings')
              }
              className='group flex flex-col items-center justify-center gap-1 transition-all duration-300 font-sans'
            >
              <div className='transition-all duration-300'>
                <Icon
                  size={24}
                  className='transition-transform duration-300 group-active:scale-95'
                  style={{
                    color: isActive ? accentColor : 'rgba(255, 255, 255, 0.5)',
                  }}
                />
              </div>
              <span
                className='text-[10px] font-medium tracking-wide transition-colors duration-300'
                style={{
                  color: isActive ? accentColor : 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
