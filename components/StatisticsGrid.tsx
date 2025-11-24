'use client';

import { useState } from 'react';
import type { Semester } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { ChevronDown } from 'lucide-react';

interface StatisticsGridProps {
  semesterName: string;
  totalCredits: number;
  sgpa: number;
  cgpa: number;
  accentColor: string;
  selectedId: string;
  semesters: Semester[];
  onSelect: (id: string) => void;
}

export default function StatisticsGrid({
  semesterName,
  totalCredits,
  sgpa,
  cgpa,
  accentColor,
  selectedId,
  semesters,
  onSelect,
}: StatisticsGridProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='grid grid-cols-2 gap-3'>
      <div className='relative'>
        <GlassCard className='p-4'>
          <p className='text-xs text-neutral-500 mb-1 font-sans'>Semester</p>
          <div className='p-2 cursor-pointer hover:bg-neutral-800 transition-colors'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='w-full flex items-center justify-between text-white font-medium font-sans text-sm'
            >
              <span>{semesterName}</span>
              <ChevronDown
                size={16}
                style={{
                  transform: isOpen ? 'rotate(180deg)' : '',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
          </div>
        </GlassCard>

        {isOpen && (
          <div className='absolute top-full left-0 mt-2 w-full z-50 pt-1'>
            <GlassCard className='rounded-2xl overflow-hidden'>
              <div className='max-h-64 overflow-y-auto'>
                {semesters.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => {
                      onSelect(sem.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-sans transition-colors text-sm ${
                      selectedId === sem.id
                        ? 'bg-neutral-800 text-white font-medium'
                        : 'text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    {sem.name}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      <GlassCard className='p-4'>
        <p className='text-xs text-neutral-500 mb-1 font-sans'>CGPA</p>
        <p
          className='text-2xl font-light font-sans'
          style={{ color: accentColor }}
        >
          {cgpa.toFixed(2)}
        </p>
      </GlassCard>

      <GlassCard className='p-4'>
        <p className='text-xs text-neutral-500 mb-1 font-sans'>SGPA</p>
        <p
          className='text-2xl font-light font-sans'
          style={{ color: accentColor }}
        >
          {sgpa.toFixed(2)}
        </p>
      </GlassCard>

      <GlassCard className='p-4'>
        <p className='text-xs text-neutral-500 mb-1 font-sans'>Credits</p>
        <p
          className='text-2xl font-light font-sans'
          style={{ color: accentColor }}
        >
          {totalCredits}
        </p>
      </GlassCard>
    </div>
  );
}
