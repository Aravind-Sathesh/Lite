'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type CGPADisplayMode = 'overall' | 'through-selected';

type ColorContextType = {
  accentColor: string;
  setAccentColor: (color: string) => void;
  cgpaDisplayMode: CGPADisplayMode;
  setCgpaDisplayMode: (mode: CGPADisplayMode) => void;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

const COLOR_PRESETS = {
  blue: '#0a84ff',
  purple: '#a855f7',
  green: '#10b981',
  indigo: '#6366f1',
  red: '#ef4444',
};

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState(() => {
    if (typeof window === 'undefined') {
      return '#0a84ff';
    }

    const saved = localStorage.getItem('cgpa_settings');

    if (!saved) {
      return '#0a84ff';
    }

    try {
      const settings = JSON.parse(saved);
      return settings.accentColor || '#0a84ff';
    } catch (e) {
      console.error('Failed to parse settings:', e);
      return '#0a84ff';
    }
  });
  const [cgpaDisplayMode, setCgpaDisplayModeState] = useState<CGPADisplayMode>(
    () => {
      if (typeof window === 'undefined') {
        return 'overall';
      }

      const saved = localStorage.getItem('cgpa_settings');

      if (!saved) {
        return 'overall';
      }

      try {
        const settings = JSON.parse(saved);
        return settings.cgpaDisplayMode === 'through-selected'
          ? settings.cgpaDisplayMode
          : 'overall';
      } catch (e) {
        console.error('Failed to parse settings:', e);
        return 'overall';
      }
    },
  );

  const persistSettings = (nextSettings: {
    accentColor?: string;
    cgpaDisplayMode?: CGPADisplayMode;
  }) => {
    try {
      const settings = {
        accentColor,
        cgpaDisplayMode,
        ...nextSettings,
      };
      localStorage.setItem('cgpa_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    persistSettings({ accentColor: color });
    document.documentElement.style.setProperty('--accent-dynamic', color);
  };

  const setCgpaDisplayMode = (mode: CGPADisplayMode) => {
    setCgpaDisplayModeState(mode);
    persistSettings({ cgpaDisplayMode: mode });
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-dynamic', accentColor);
  }, [accentColor]);

  return (
    <ColorContext.Provider
      value={{
        accentColor,
        setAccentColor,
        cgpaDisplayMode,
        setCgpaDisplayMode,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColor must be used within ColorProvider');
  }
  return context;
}

export { COLOR_PRESETS };
