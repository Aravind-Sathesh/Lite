'use client';

import type { Course } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { Trash2 } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  semesterId: string;
  onDelete: (semesterId: string, courseId: string) => void;
  onUpdate: (
    semesterId: string,
    courseId: string,
    updates: Partial<Course>
  ) => void;
  accentColor: string;
}

export default function CourseList({
  courses,
  semesterId,
  onDelete,
  onUpdate,
  accentColor,
}: CourseListProps) {
  return (
    <div className='space-y-2'>
      {courses.map((course) => (
        <GlassCard
          key={course.id}
          className='p-4 rounded-2xl flex items-center gap-3'
        >
          {/* Course Code */}
          <div className='shrink-0 text-center'>
            <p className='text-xs text-neutral-500'>
              {course.code.split(/(\d+)/)[0]}
            </p>
            <p className='text-sm font-semibold text-white'>
              {course.code.split(/(\d+)/)[1] || ''}
            </p>
          </div>

          {/* Course Info */}
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-white truncate'>
              {course.name}
            </p>
            <p className='text-xs text-neutral-500'>{course.credits} credits</p>
          </div>

          {/* Grade */}
          <div className='flex items-center gap-2'>
            <div style={{ color: accentColor }} className='text-sm font-bold'>
              {course.grade}
            </div>
            <button
              onClick={() => onDelete(semesterId, course.id)}
              className='p-1 hover:bg-white/5 rounded-lg transition-colors text-neutral-400 hover:text-red-400'
            >
              <Trash2 size={16} />
            </button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
