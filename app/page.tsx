'use client';

import { useState } from 'react';
import CalculatorScreen from '@/components/screens/CalculatorScreen';
import SummaryScreen from '@/components/screens/SummaryScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import BottomNav from '@/components/BottomNav';

type Screen = 'calculator' | 'summary' | 'settings';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<Screen>('calculator');

  return (
    <main className='relative w-full min-h-dvh overflow-hidden bg-neutral-950 flex justify-center'>
      <div className='w-full max-w-md h-full flex flex-col'>
        <div className='flex-1 overflow-y-auto pb-32'>
          {activeScreen === 'calculator' && <CalculatorScreen />}
          {activeScreen === 'summary' && <SummaryScreen />}
          {activeScreen === 'settings' && <SettingsScreen />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
        />
      </div>
    </main>
  );
}
