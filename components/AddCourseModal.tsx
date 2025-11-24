'use client';

import { useState } from 'react';
import type { Course } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { X, ChevronDown } from 'lucide-react';
// Directly import the JSON data so it's available immediately
import coursesData from '@/data/courses.json';

const COURSE_LIST = coursesData.courses;

const GRADES = ['A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'E', 'NC'];
const COURSE_TYPES = ['CDC', 'OpEL', 'HuEL', 'DEL'];

interface AddCourseModalProps {
  onClose: () => void;
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  accentColor: string;
}

export default function AddCourseModal({
  onClose,
  onAddCourse,
  accentColor,
}: AddCourseModalProps) {
  const [courseInput, setCourseInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<{
    code: string;
    name: string;
    credits: number;
  } | null>(null);
  const [credits, setCredits] = useState('4');
  const [grade, setGrade] = useState('A');
  const [courseType, setCourseType] = useState('CDC');
  const [searchResults, setSearchResults] = useState<typeof COURSE_LIST>([]);

  const [showSearch, setShowSearch] = useState(false);
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const handleCourseInputChange = (value: string) => {
    setCourseInput(value);

    // Clear selected course if user types something new
    if (
      selectedCourse &&
      value !== `${selectedCourse.code} - ${selectedCourse.name}`
    ) {
      setSelectedCourse(null);
    }

    if (value.length > 0) {
      const results = COURSE_LIST.filter(
        (c) =>
          c.code.toLowerCase().includes(value.toLowerCase()) ||
          c.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 50); // Limit results for performance

      setSearchResults(results);
      setShowSearch(results.length > 0);
      setIsCustomCourse(results.length === 0);
    } else {
      setShowSearch(false);
      setSearchResults([]);
      setIsCustomCourse(false);
    }
  };

  const handleSelectCourse = (course: (typeof COURSE_LIST)[0]) => {
    setSelectedCourse(course);
    setCourseInput(`${course.code} - ${course.name}`);
    setCredits(course.credits.toString()); // Auto-fill credits
    setShowSearch(false);
    setSearchResults([]);
    setIsCustomCourse(false);
  };

  const handleAddCourse = () => {
    let code = '';
    let name = '';
    let creditsNum = 4;

    if (selectedCourse) {
      code = selectedCourse.code;
      name = selectedCourse.name;
      creditsNum = selectedCourse.credits;
    } else {
      // Try to parse code and name from input if manually typed
      // Expected format: "CODE - Name" or just "Name"
      const match = courseInput.match(/^(.*?)\s*-\s*(.*)$/);
      if (match) {
        code = match[1].trim();
        name = match[2].trim();
      } else {
        code = courseInput.trim().split(' ')[0] || 'CUSTOM'; // Fallback code
        name = courseInput.trim();
      }
      creditsNum = Number.parseInt(credits) || 4;
    }

    if (!code || !name) {
      alert('Please enter a course name');
      return;
    }

    onAddCourse({
      code,
      name,
      credits: creditsNum,
      grade,
      type: courseType, // Don't forget to save the type
    });

    // Reset form
    setCourseInput('');
    setSelectedCourse(null);
    setCredits('4');
    setGrade('A');
    setCourseType('CDC');
    setIsCustomCourse(false);
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
            <h2 className='text-lg font-semibold text-white'>Add Course</h2>
            <button
              onClick={onClose}
              className='p-1 hover:bg-white/10 rounded-lg transition-colors text-neutral-400'
            >
              <X size={20} />
            </button>
          </div>

          {/* Course Search Input (Code + Name) */}
          <div className='relative'>
            <label className='text-xs font-medium text-neutral-400 block mb-2'>
              Course Code or Name
            </label>
            <input
              type='text'
              value={courseInput}
              onChange={(e) => handleCourseInputChange(e.target.value)}
              placeholder='e.g., CS F111 or Computer Programming'
              className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-white/20'
            />
            {/* Search Results */}
            {showSearch && (
              <div className='absolute w-full mt-2 max-h-48 overflow-y-auto space-y-1 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-1 z-50 shadow-xl'>
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCourse(result)}
                    className='w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-white group'
                  >
                    <p className='font-medium text-xs text-neutral-400 group-hover:text-white transition-colors'>
                      {result.code}
                    </p>
                    <p className='truncate'>{result.name}</p>
                  </button>
                ))}
              </div>
            )}
            {isCustomCourse && (
              <p className='mt-2 text-xs text-neutral-400'>
                Custom course - enter details below
              </p>
            )}
          </div>

          {/* Grade and Type Side by Side */}
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

            {/* Course Type Dropdown */}
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
                  <span className='text-lg'>{courseType}</span>
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
                      {COURSE_TYPES.map((type) => (
                        <button
                          key={type}
                          type='button'
                          onClick={() => {
                            setCourseType(type);
                            setIsTypeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            courseType === type
                              ? 'bg-white/10 text-neutral-100 font-medium'
                              : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          {type}
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
              onClick={onClose}
              className='flex-1 py-3 rounded-lg font-medium border transition-all active:scale-95'
              style={{
                borderColor: accentColor,
                color: accentColor,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddCourse}
              className='flex-1 py-3 rounded-lg font-medium transition-all active:scale-95'
              style={{
                backgroundColor: accentColor,
                color: '#fff',
              }}
            >
              Add
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
