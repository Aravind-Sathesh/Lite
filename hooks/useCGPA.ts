'use client';

import { useEffect, useState } from 'react';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
  type?: string;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export interface CGPAData {
  semesters: Semester[];
  lastSelectedSemester?: string;
}

const GRADING_SCALE: Record<string, number> = {
  A: 10,
  'A-': 9,
  B: 8,
  'B-': 7,
  C: 6,
  'C-': 5,
  D: 4,
  E: 2,
  NC: 0,
};

const STORAGE_KEY = 'cgpa_data_courses';

export function useCGPA() {
  const [data, setData] = useState<CGPAData>({ semesters: [] });
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse CGPA data:', e);
      }
    } else {
      // Initialize with default semesters
      const defaultSemesters = [
        '1-1',
        '1-2',
        '2-1',
        '2-2',
        'ST-1',
        '3-1',
        '3-2',
        'ST-2',
        '4-1',
        '4-2',
      ].map((name) => ({
        id: name,
        name,
        courses: [],
      }));
      setData({
        semesters: defaultSemesters,
        lastSelectedSemester: defaultSemesters[0]?.id,
      });
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, mounted]);

  const calculateSGPA = (semester: Semester): number => {
    if (semester.courses.length === 0) return 0;
    const filteredCourses = semester.courses;
    const totalGradePoints = filteredCourses.reduce((sum, course) => {
      if (course.type === 'GD' || course.type === 'CLR') return sum;
      const gradePoint = GRADING_SCALE[course.grade] || 0;
      return sum + gradePoint * course.credits;
    }, 0);
    const totalCredits = filteredCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );
    // For SGPA, credits include GD/CLR, but grade points do not
    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const calculateCGPA = (): number => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    data.semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        if (course.type === 'GD' || course.type === 'CLR') return;
        const gradePoint = GRADING_SCALE[course.grade] || 0;
        totalGradePoints += gradePoint * course.credits;
        totalCredits += course.credits;
      });
    });

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const addCourse = (semesterId: string, course: Omit<Course, 'id'>) => {
    setData((prev) => ({
      semesters: prev.semesters.map((sem) => {
        if (sem.id === semesterId) {
          return {
            ...sem,
            courses: [
              ...sem.courses,
              { ...course, id: `${semesterId}-${Date.now()}` },
            ],
          };
        }
        return sem;
      }),
    }));
  };

  const deleteCourse = (semesterId: string, courseId: string) => {
    setData((prev) => ({
      semesters: prev.semesters.map((sem) => {
        if (sem.id === semesterId) {
          return {
            ...sem,
            courses: sem.courses.filter((c) => c.id !== courseId),
          };
        }
        return sem;
      }),
    }));
  };

  const updateCourse = (
    semesterId: string,
    courseId: string,
    updates: Partial<Course>
  ) => {
    setData((prev) => ({
      semesters: prev.semesters.map((sem) => {
        if (sem.id === semesterId) {
          return {
            ...sem,
            courses: sem.courses.map((c) =>
              c.id === courseId ? { ...c, ...updates } : c
            ),
          };
        }
        return sem;
      }),
    }));
  };

  const exportData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.semesters && Array.isArray(imported.semesters)) {
        setData(imported);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  };

  return {
    data,
    calculateSGPA,
    calculateCGPA,
    addCourse,
    deleteCourse,
    updateCourse,
    exportData,
    importData,
    mounted,
  };
}
