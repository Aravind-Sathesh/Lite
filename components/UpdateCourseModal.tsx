import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Course } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { X, Trash2 } from 'lucide-react';

interface UpdateCourseModalProps {
  course: Course;
  onClose: () => void;
  onUpdate: (updates: Partial<Course>) => void;
  onDelete: () => void;
  accentColor: string;
}

export default function UpdateCourseModal({
  course,
  onClose,
  onUpdate,
  onDelete,
  accentColor,
}: UpdateCourseModalProps) {
  const [name, setName] = useState(course.name);
  const [credits, setCredits] = useState(course.credits.toString());
  const [grade, setGrade] = useState(course.grade);
  const [type, setType] = useState(course.type || 'CDC');
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const GRADES = ['A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'E', 'NC', 'GD', 'CLR'];
  const COURSE_TYPES = ['CDC', 'OpEL', 'HuEL', 'DEL'];

  const handleUpdate = () => {
    if (!name || !credits || !grade) {
      alert('Please fill in all fields');
      return;
    }
    let creditsNum = Number.parseInt(credits);
    // If grade is GD or CLR, set credits to 0
    if (grade === 'GD' || grade === 'CLR') {
      creditsNum = 0;
    }
    onUpdate({
      name,
      credits: creditsNum,
      grade,
      type,
    });
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Background Overlay */}
      <div
        className='absolute inset-0 bg-black/20 backdrop-blur-xl'
        onClick={onClose}
      />
      {/* Modal Container */}
      <div className='relative w-full max-w-sm'>
        <GlassCard className='p-6 rounded-3xl space-y-4 max-h-[90vh] overflow-y-auto'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-white'>Update Course</h2>
            <button
              onClick={onClose}
              className='p-1 hover:bg-white/10 rounded-lg transition-colors text-neutral-400'
            >
              <X size={20} />
            </button>
          </div>
          {/* Course Name Input */}
          <div>
            <label className='text-xs font-medium text-neutral-400 block mb-2'>
              Course Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-white/20'
            />
          </div>
          {/* Grade and Type Side by Side Dropdowns */}
          <div className='flex gap-3'>
            {/* Grade Dropdown */}
            <div className='relative w-1/2'>
              <label className='text-xs font-medium text-neutral-400 block mb-2'>
                Grade
              </label>
              <GlassCard className='px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors'>
                <button
                  type='button'
                  onClick={() => setIsGradeOpen(!isGradeOpen)}
                  className='w-full flex items-center justify-between text-white font-medium'
                >
                  <span className='text-lg'>{grade}</span>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: isGradeOpen ? 'rotate(180deg)' : '',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
              </GlassCard>
              {isGradeOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 z-40'>
                  <GlassCard className='rounded-2xl overflow-hidden'>
                    <div className='max-h-40 overflow-y-auto overscroll-contain'>
                      {GRADES.map((g) => (
                        <button
                          key={g}
                          type='button'
                          onClick={() => {
                            setGrade(g);
                            setIsGradeOpen(false);
                            // If GD or CLR, set credits to 0
                            if (g === 'GD' || g === 'CLR') {
                              setCredits('0');
                            }
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            grade === g
                              ? 'bg-white/10 text-neutral-100 font-medium'
                              : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
            {/* Type Dropdown */}
            <div className='relative w-1/2'>
              <label className='text-xs font-medium text-neutral-400 block mb-2'>
                Type
              </label>
              <GlassCard className='px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors'>
                <button
                  type='button'
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className='w-full flex items-center justify-between text-white font-medium'
                >
                  <span className='text-lg'>{type}</span>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: isTypeOpen ? 'rotate(180deg)' : '',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
              </GlassCard>
              {isTypeOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 z-40'>
                  <GlassCard className='rounded-2xl overflow-hidden'>
                    <div className='max-h-40 overflow-y-auto overscroll-contain'>
                      {COURSE_TYPES.map((t) => (
                        <button
                          key={t}
                          type='button'
                          onClick={() => {
                            setType(t);
                            setIsTypeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            type === t
                              ? 'bg-white/10 text-neutral-100 font-medium'
                              : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
          {/* Credits Input */}
          <div>
            <label className='text-xs font-medium text-neutral-400 block mb-2'>
              Credits
            </label>
            <input
              type='number'
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              min='1'
              max='6'
              className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/20'
            />
          </div>
          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              onClick={onDelete}
              className='flex-1 py-3 rounded-lg font-medium border transition-all active:scale-95 text-red-400 border-red-400 flex items-center justify-center gap-2'
            >
              <Trash2 size={18} /> Delete
            </button>
            <button
              onClick={handleUpdate}
              className='flex-1 py-3 rounded-lg font-medium transition-all active:scale-95'
              style={{ backgroundColor: accentColor, color: '#fff' }}
            >
              Update
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
