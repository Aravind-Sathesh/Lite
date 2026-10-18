'use client';

import { useState } from 'react';
import { useColor, COLOR_PRESETS } from '@/contexts/ColorContext';
import { useCGPA } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { Download, Upload, Palette, ChevronDown } from 'lucide-react';
import minorsData from '@/data/minors.json';

export default function SettingsScreen() {
  const {
    accentColor,
    setAccentColor,
    cgpaDisplayMode,
    setCgpaDisplayMode,
    minor,
    setMinor,
  } = useColor();
  const { exportData, importData } = useCGPA();
  const [isMinorOpen, setIsMinorOpen] = useState(false);
  const minorOptions = ['', ...minorsData.minors.map((m) => m.name)];

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

      {/* CGPA Display Mode */}
      <div>
        <h3 className='text-sm font-semibold text-neutral-200 mb-4'>
          CGPA Display
        </h3>
        <GlassCard className='p-2 rounded-2xl flex gap-2'>
          <button
            onClick={() => setCgpaDisplayMode('overall')}
            className='flex-1 py-3 rounded-xl text-sm font-medium transition-all active:scale-95'
            style={{
              backgroundColor:
                cgpaDisplayMode === 'overall' ? accentColor : 'transparent',
              color:
                cgpaDisplayMode === 'overall'
                  ? '#fff'
                  : 'rgba(255,255,255,0.7)',
            }}
          >
            Overall
          </button>
          <button
            onClick={() => setCgpaDisplayMode('through-selected')}
            className='flex-1 py-3 rounded-xl text-sm font-medium transition-all active:scale-95'
            style={{
              backgroundColor:
                cgpaDisplayMode === 'through-selected'
                  ? accentColor
                  : 'transparent',
              color:
                cgpaDisplayMode === 'through-selected'
                  ? '#fff'
                  : 'rgba(255,255,255,0.7)',
            }}
          >
            Up to Semester
          </button>
        </GlassCard>
        <p className='mt-2 text-xs text-neutral-400'>
          Overall keeps the current CGPA across all semesters. Up to Semester
          ignores any future semesters when showing the selected semester CGPA.
        </p>
      </div>

      {/* Minor Program */}
      <div>
        <h3 className='text-sm font-semibold text-neutral-200 mb-4'>Minor</h3>
        <div className='relative'>
          <GlassCard className='px-4 py-3 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors'>
            <button
              type='button'
              onClick={() => setIsMinorOpen(!isMinorOpen)}
              className='w-full flex items-center justify-between text-sm text-white font-medium'
            >
              <span>{minor || 'None'}</span>
              <ChevronDown
                size={16}
                className='text-neutral-400'
                style={{
                  transform: isMinorOpen ? 'rotate(180deg)' : '',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
          </GlassCard>
          {isMinorOpen && (
            <div className='absolute top-full left-0 right-0 mt-2 z-40'>
              <GlassCard className='rounded-2xl overflow-hidden'>
                <div className='max-h-64 overflow-y-auto overscroll-contain'>
                  {minorOptions.map((m) => (
                    <button
                      key={m || 'none'}
                      type='button'
                      onClick={() => {
                        setMinor(m);
                        setIsMinorOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        minor === m
                          ? 'bg-white/10 text-neutral-100 font-medium'
                          : 'text-neutral-300 hover:bg-white/5'
                      }`}
                    >
                      {m || 'None'}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
        <p className='mt-2 text-xs text-neutral-400'>
          Lets you mark courses as counting towards your minor and tracks progress in Summary.
        </p>
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
