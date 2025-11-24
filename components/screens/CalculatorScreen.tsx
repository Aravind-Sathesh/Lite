'use client';

import { useState, useEffect } from 'react';
import { useCGPA } from '@/hooks/useCGPA';
import { useColor } from '@/contexts/ColorContext';
import StatisticsGrid from '@/components/StatisticsGrid';
import CourseList from '@/components/CourseList';
import AddCourseModal from '@/components/AddCourseModal';
import { Plus } from 'lucide-react';

export default function CalculatorScreen() {
  const {
    data,
    calculateSGPA,
    calculateCGPA,
    addCourse,
    deleteCourse,
    updateCourse,
  } = useCGPA();
  const { accentColor } = useColor();
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(() => {
    const lastSelected =
      typeof window !== 'undefined'
        ? localStorage.getItem('lastSelectedSemester')
        : null;
    if (lastSelected) {
      return lastSelected;
    }
    return '1-1';
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (
      data.semesters.length > 0 &&
      !data.semesters.some((s) => s.id === selectedSemesterId)
    ) {
      Promise.resolve().then(() => {
        setSelectedSemesterId(data.semesters[0]?.id || '1-1');
      });
    }
  }, [data.semesters, selectedSemesterId]);

  const handleSemesterChange = (id: string) => {
    setSelectedSemesterId(id);
    localStorage.setItem('lastSelectedSemester', id);
  };

  const selectedSemester = data.semesters.find(
    (s) => s.id === selectedSemesterId
  );
  const sgpa = selectedSemester ? calculateSGPA(selectedSemester) : 0;
  const cgpa = calculateCGPA();

  return (
    <div className='space-y-4 px-4 font-sans'>
      {selectedSemester && (
        <StatisticsGrid
          semesterName={selectedSemester.name}
          totalCredits={selectedSemester.courses.reduce(
            (sum, c) => sum + c.credits,
            0
          )}
          sgpa={sgpa}
          cgpa={cgpa}
          accentColor={accentColor}
          selectedId={selectedSemesterId}
          semesters={data.semesters}
          onSelect={handleSemesterChange}
        />
      )}

      {/* Course List */}
      {selectedSemester && (
        <div className='space-y-3'>
          <CourseList
            courses={selectedSemester.courses}
            semesterId={selectedSemesterId}
            onDelete={deleteCourse}
            onUpdate={updateCourse}
            accentColor={accentColor}
          />

          {/* Add Course Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className='w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95'
            style={{
              border: `2px solid ${accentColor}`,
              color: `${accentColor}`,
            }}
          >
            <Plus size={20} />
            Add Course
          </button>

          {/* Empty State */}
          {selectedSemester.courses.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-neutral-500 text-sm mb-4'>
                No courses added yet
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className='px-6 py-2 rounded-lg text-sm font-medium transition-all'
                style={{
                  backgroundColor: accentColor,
                  color: '#fff',
                }}
              >
                Add First Course
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <AddCourseModal
          onClose={() => setShowAddModal(false)}
          onAddCourse={(course) => {
            if (selectedSemesterId) {
              addCourse(selectedSemesterId, course);
            }
            setShowAddModal(false);
          }}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}
