'use client';

import { useColor, COLOR_PRESETS } from '@/contexts/ColorContext';
import { useCGPA } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { Download, Upload } from 'lucide-react';

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

  const handleColorChange = (color: string) => {
    setAccentColor(color);
  };

  return (
    <div className='space-y-6 px-4'>
      {/* Accent Color Picker */}
      <div>
        <h3 className='text-sm font-semibold text-white mb-4'>Accent Color</h3>
        <div className='space-y-4'>
          {/* Preset Colors */}
          <div className='flex gap-3 justify-between'>
            {Object.entries(COLOR_PRESETS).map(([name, color]) => (
              <button
                key={name}
                onClick={() => handleColorChange(color)}
                className='w-12 h-12 rounded-full border-2 transition-all active:scale-95'
                style={{
                  backgroundColor: color,
                  borderColor: accentColor === color ? '#fff' : 'transparent',
                }}
                title={name}
              />
            ))}
          </div>

          <GlassCard className='p-4 rounded-xl'>
            <label className='text-xs text-neutral-400 block mb-2'>
              Custom Color
            </label>
            <input
              type='color'
              value={accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className='w-full h-12 rounded-lg cursor-pointer'
            />
          </GlassCard>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className='text-sm font-semibold text-white mb-4'>
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
