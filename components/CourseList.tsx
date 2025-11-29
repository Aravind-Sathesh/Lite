'use client';

import type { Course } from '@/hooks/useCGPA';
import GlassCard from '@/components/GlassCard';
import { Trash2 } from 'lucide-react';
import UpdateCourseModal from '@/components/UpdateCourseModal';
import { useState } from 'react';

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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleUpdate = (updates: Partial<Course>) => {
    if (selectedCourse) {
      onUpdate(semesterId, selectedCourse.id, updates);
    }
    setSelectedCourse(null);
  };

  const handleDelete = () => {
    if (selectedCourse) {
      onDelete(semesterId, selectedCourse.id);
    }
    setSelectedCourse(null);
  };

  return (
    <div className='space-y-2'>
      {courses.map((course) => (
        <GlassCard
          key={course.id}
          className='p-4 rounded-2xl flex items-center gap-3 cursor-pointer'
          onClick={() => setSelectedCourse(course)}
        >
          {/* Course Code */}
          <div className='shrink-0 text-center min-w-10'>
            {(() => {
              const match = course.code.match(/^([A-Za-z]+)(.*)$/);
              const prefix = match?.[1] || '';
              const rest = match?.[2] || '';
              return (
                <>
                  <p className='text-xs text-neutral-400'>{prefix}</p>
                  <p className='text-sm font-semibold text-white'>{rest}</p>
                </>
              );
            })()}
          </div>

          {/* Course Info */}
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-white truncate'>
              {course.name}
            </p>
            <p className='text-xs text-neutral-400'>{course.credits} credits</p>
          </div>

          {/* Grade */}
          <div className='flex items-center gap-2 min-w-4'>
            <div style={{ color: accentColor }} className='text-sm font-bold'>
              {course.grade}
            </div>
          </div>
        </GlassCard>
      ))}
      {selectedCourse && (
        <UpdateCourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}
