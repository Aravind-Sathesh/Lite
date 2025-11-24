'use client';

import { useState } from 'react';
import { useCGPA } from '@/hooks/useCGPA';
import { useColor } from '@/contexts/ColorContext';
import GlassCard from '@/components/GlassCard';
import CGPAChart from '@/components/CGPAChart';

export default function SummaryScreen() {
  const { data, calculateCGPA, calculateSGPA } = useCGPA();
  const { accentColor } = useColor();
  const [showTable, setShowTable] = useState(false);

  const cgpa = calculateCGPA();
  const totalCredits = data.semesters.reduce(
    (sum, sem) => sum + sem.courses.reduce((s, c) => s + c.credits, 0),
    0
  );

  const getCourseTypeStats = () => {
    const cdcCourses = data.semesters.reduce(
      (sum, sem) => sum + sem.courses.filter((c) => c.type === 'CDC').length,
      0
    );
    const cdcCredits = data.semesters.reduce(
      (sum, sem) =>
        sum +
        sem.courses
          .filter((c) => c.type === 'CDC')
          .reduce((s, c) => s + c.credits, 0),
      0
    );

    const opelCourses = data.semesters.reduce(
      (sum, sem) => sum + sem.courses.filter((c) => c.type === 'OpEL').length,
      0
    );
    const opelCredits = data.semesters.reduce(
      (sum, sem) =>
        sum +
        sem.courses
          .filter((c) => c.type === 'OpEL')
          .reduce((s, c) => s + c.credits, 0),
      0
    );

    const huelCourses = data.semesters.reduce(
      (sum, sem) => sum + sem.courses.filter((c) => c.type === 'HuEL').length,
      0
    );
    const huelCredits = data.semesters.reduce(
      (sum, sem) =>
        sum +
        sem.courses
          .filter((c) => c.type === 'HuEL')
          .reduce((s, c) => s + c.credits, 0),
      0
    );

    const delCourses = data.semesters.reduce(
      (sum, sem) => sum + sem.courses.filter((c) => c.type === 'DEL').length,
      0
    );
    const delCredits = data.semesters.reduce(
      (sum, sem) =>
        sum +
        sem.courses
          .filter((c) => c.type === 'DEL')
          .reduce((s, c) => s + c.credits, 0),
      0
    );

    return {
      cdcCourses,
      cdcCredits,
      opelCourses,
      opelCredits,
      huelCourses,
      huelCredits,
      delCourses,
      delCredits,
    };
  };

  const stats = getCourseTypeStats();

  return (
    <div className='space-y-6 px-4'>
      {/* Hero Card - CGPA */}
      <GlassCard className='p-4 rounded-3xl flex items-center justify-between'>
        <p className='text-neutral-400 text-sm font-medium'>CURRENT CGPA</p>
        <p className='text-3xl font-light' style={{ color: accentColor }}>
          {cgpa.toFixed(2)}
        </p>
      </GlassCard>

      {/* Progress Section */}
      <div>
        <div className='flex justify-between items-center mb-3'>
          <span className='text-sm text-neutral-400'>Total Progress</span>
          <span className='text-xs text-neutral-500'>
            {totalCredits} / 144 Credits (
            {Math.round((totalCredits / 144) * 100)}%)
          </span>
        </div>
        <div className='w-full h-2 bg-white/5 rounded-full overflow-hidden'>
          <div
            className='h-full rounded-full transition-all duration-300'
            style={{
              width: `${Math.min((totalCredits / 144) * 100, 100)}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* Course Stats */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium text-neutral-300'>
          Course Breakdown
        </h3>

        <GlassCard className='p-4 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-neutral-400'>Core Courses</span>
            <div className='text-right'>
              <div className='text-xl font-semibold text-white'>
                {stats.cdcCourses - 19} / 14
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className='p-4 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-neutral-400'>Open Elective</span>
            <div className='text-right'>
              <div className='text-xl font-semibold text-white'>
                {stats.opelCourses} / 5
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className='p-4 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-neutral-400'>Humanity Elective</span>
            <div className='text-right'>
              <div className='text-xl font-semibold text-white'>
                {stats.huelCourses} / 3
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className='p-4 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-neutral-400'>
              Discipline Elective
            </span>
            <div className='text-right'>
              <div className='text-xl font-semibold text-white'>
                {stats.delCourses} / 4
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Chart Section */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-neutral-300'>
            Semester Progress
          </h3>
          <button
            onClick={() => setShowTable(!showTable)}
            className='text-xs px-3 py-1 rounded-lg transition-colors'
            style={{
              backgroundColor: accentColor,
              color: '#fff',
            }}
          >
            {showTable ? 'Graph' : 'Table'}
          </button>
        </div>

        {showTable ? (
          <GlassCard className='p-4 rounded-2xl overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/8'>
                  <th className='text-left py-2 px-2 text-neutral-400 font-medium'>
                    Semester
                  </th>
                  <th className='text-left py-2 px-2 text-neutral-400 font-medium'>
                    SGPA
                  </th>
                  <th className='text-left py-2 px-2 text-neutral-400 font-medium'>
                    CGPA
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.semesters.map((sem, index) => {
                  const sgpa = calculateSGPA(sem);
                  const semestersUpToNow = data.semesters.slice(0, index + 1);
                  let totalGradePoints = 0;
                  let totalCredits = 0;
                  semestersUpToNow.forEach((s) => {
                    s.courses.forEach((c) => {
                      const gradePoint =
                        {
                          A: 10,
                          'A-': 9,
                          B: 8,
                          'B-': 7,
                          C: 6,
                          'C-': 5,
                          D: 4,
                          E: 2,
                          NC: 0,
                        }[c.grade] || 0;
                      totalGradePoints += gradePoint * c.credits;
                      totalCredits += c.credits;
                    });
                  });
                  const cgpaUpToNow =
                    totalCredits > 0 ? totalGradePoints / totalCredits : 0;

                  return (
                    <tr
                      key={sem.id}
                      className='border-b border-white/5 hover:bg-white/2'
                    >
                      <td className='py-2 px-2 text-white'>{sem.name}</td>
                      <td className='py-2 px-2' style={{ color: accentColor }}>
                        {sgpa.toFixed(2)}
                      </td>
                      <td className='py-2 px-2 text-neutral-400'>
                        {cgpaUpToNow.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </GlassCard>
        ) : (
          <CGPAChart data={data} accentColor={accentColor} />
        )}
      </div>
    </div>
  );
}
