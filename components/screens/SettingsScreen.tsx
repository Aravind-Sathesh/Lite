'use client';

import { useColor, COLOR_PRESETS } from '@/contexts/ColorContext';
import { useCGPA } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { Download, Upload, Palette } from 'lucide-react';

export default function SettingsScreen() {
  const { accentColor, setAccentColor } = useColor();
  const { exportData, importData } = useCGPA();

  const handleExport = async () => {
    const data = exportData();
    try {
      await navigator.clipboard.writeText(data);
      alert('Data copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleImport = async () => {
    try {
      const data = await navigator.clipboard.readText();
      if (importData(data)) {
        alert('Data imported successfully!');
      } else {
        alert('Invalid data format');
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Unable to access clipboard');
    }
  };

  return (
    <div className='space-y-6 px-4'>
      {/* Accent Color Picker */}
      <div>
        <h3 className='text-sm font-semibold text-neutral-200 mb-4'>
          Accent Color
        </h3>
        <div className='space-y-4'>
          {/* Preset Colors */}
          <div className='flex gap-3 justify-between'>
            {Object.entries(COLOR_PRESETS).map(([name, color]) => (
              <button
                key={name}
                onClick={() => setAccentColor(color)}
                className='w-12 h-12 rounded-full border-2 transition-all active:scale-95'
                style={{
                  backgroundColor: color,
                  borderColor: accentColor === color ? '#fff' : 'transparent',
                }}
                title={name}
              />
            ))}
          </div>

          {/* Custom Color Picker */}
          <GlassCard className='p-4 rounded-xl flex items-center gap-4 relative overflow-hidden'>
            <div
              className='relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shrink-0 shadow-lg'
              style={{ backgroundColor: accentColor }}
            >
              {/* Native Color Input - Invisible overlay */}
              <input
                type='color'
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className='absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 cursor-pointer opacity-0'
              />
            </div>

            <div className='flex-1'>
              <label className='text-xs text-neutral-400 block mb-1'>
                Custom Color
              </label>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-neutral-200 font-mono uppercase tracking-wider'>
                  {accentColor}
                </p>
                <Palette size={16} className='text-neutral-400' />
              </div>
            </div>

            {/* Visual hint that whole card is clickable */}
            <input
              type='color'
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            />
          </GlassCard>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className='text-sm font-semibold text-neutral-200 mb-4'>
          Data Management
        </h3>
        <div className='space-y-3'>
          <button
            onClick={handleExport}
            className='w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95'
            style={{
              backgroundColor: accentColor,
              color: '#fff',
            }}
          >
            <Download size={18} />
            Export Data
          </button>
          <button
            onClick={handleImport}
            className='w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95 border'
            style={{
              borderColor: accentColor,
              color: accentColor,
            }}
          >
            <Upload size={18} />
            Import Data
          </button>
        </div>
      </div>

      {/* Info */}
      <GlassCard className='p-4 rounded-xl'>
        <p className='text-xs text-neutral-400'>
          Your data is stored locally on this device. Export your data regularly
          to create backups.
        </p>
      </GlassCard>
    </div>
  );
}
