'use client';

import type { CGPAData } from '@/hooks/useCGPA';
import { useCGPA } from '@/hooks/useCGPA';

interface CGPAChartProps {
  data: CGPAData;
  accentColor: string;
}

export default function CGPAChart({ data, accentColor }: CGPAChartProps) {
  const { calculateSGPA } = useCGPA();

  // Filter semesters with courses
  const semesters = data.semesters.filter((s) => s.courses.length > 0);

  if (semesters.length === 0) {
    return (
      <div className='h-48 bg-white/3 border border-white/8 rounded-2xl flex items-center justify-center text-neutral-400 text-sm'>
        No data to display
      </div>
    );
  }

  const svgWidth = 320;
  const svgHeight = 200;
  const padding = 40;
  const graphWidth = svgWidth - padding * 2;
  const graphHeight = svgHeight - padding * 2;

  // Calculate GPA values
  const gpaValues = semesters.map((sem) => calculateSGPA(sem));
  const maxGPA = 10;
  const minGPA = 0;

  // Calculate points for SVG path
  const points = gpaValues.map((gpa, idx) => {
    const x = padding + (idx / (gpaValues.length - 1 || 1)) * graphWidth;
    const y = padding + ((maxGPA - gpa) / (maxGPA - minGPA)) * graphHeight;
    return { x, y, gpa };
  });

  // Create path data
  const pathData = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  // Grid lines for GPA scale
  const gridLines = [0, 2, 4, 6, 8, 10];

  return (
    <svg
      width='100%'
      height='auto'
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className='w-full'
    >
      <defs>
        <linearGradient id='areaGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop
            offset='0%'
            style={{ stopColor: accentColor, stopOpacity: 0.2 }}
          />
          <stop
            offset='100%'
            style={{ stopColor: accentColor, stopOpacity: 0 }}
          />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map((gpa) => {
        const y = padding + ((maxGPA - gpa) / (maxGPA - minGPA)) * graphHeight;
        return (
          <g key={`grid-${gpa}`}>
            <line
              x1={padding}
              y1={y}
              x2={svgWidth - padding}
              y2={y}
              stroke='rgba(255,255,255,0.05)'
              strokeWidth='1'
            />
            <text
              x={padding - 10}
              y={y + 4}
              fontSize='10'
              fill='rgba(255,255,255,0.3)'
              textAnchor='end'
            >
              {gpa}
            </text>
          </g>
        );
      })}

      {/* Axis labels */}
      {semesters.map((sem, idx) => {
        const x = padding + (idx / (semesters.length - 1 || 1)) * graphWidth;
        return (
          <text
            key={`label-${sem.id}`}
            x={x}
            y={svgHeight - 10}
            fontSize='10'
            fill='rgba(255,255,255,0.4)'
            textAnchor='middle'
          >
            {sem.name}
          </text>
        );
      })}

      {/* Area under curve */}
      <path
        d={`${pathData} L ${points[points.length - 1].x} ${
          padding + graphHeight
        } L ${points[0].x} ${padding + graphHeight} Z`}
        fill='url(#areaGradient)'
      />

      {/* Line */}
      <path
        d={pathData}
        stroke={accentColor}
        strokeWidth='2'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      {/* Data points */}
      {points.map((p, idx) => (
        <circle
          key={`point-${idx}`}
          cx={p.x}
          cy={p.y}
          r='4'
          fill={accentColor}
        />
      ))}
    </svg>
  );
}
