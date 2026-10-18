'use client';

import { useEffect, useState } from 'react';
import CalculatorScreen from '@/components/screens/CalculatorScreen';
import SummaryScreen from '@/components/screens/SummaryScreen';
import SettingsScreen from '@/components/screens/SettingsScreen';
import BottomNav from '@/components/BottomNav';

type Screen = 'calculator' | 'summary' | 'settings';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<Screen>('calculator');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsMounted(true));
  }, []);

  if (!isMounted) {
    return <main className='fixed inset-0 bg-neutral-950' />;
  }

  return (
    <main className='fixed inset-0 overflow-hidden bg-neutral-950 flex justify-center'>
      <div className='w-full max-w-md h-full flex flex-col'>
        {/* iOS 26 skips its top scroll-edge blur when the scroller sits in an
            opaque, viewport-spanning position:fixed shell. */}
        <div
          className='flex-1 overflow-y-auto overscroll-contain pb-32'
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
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
