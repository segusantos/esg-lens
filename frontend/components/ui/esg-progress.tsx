import React from 'react';

type ESGProgressProps = {
  value: number;
  type: 'environmental' | 'social' | 'governance' | 'overall';
};

export function ESGProgress({ value, type }: ESGProgressProps) {
  // Map ESG type to tailwind classes for colors
  const colorMap = {
    environmental: {
      bg: 'bg-green-600',
      bgLight: 'bg-green-100',
    },
    social: {
      bg: 'bg-blue-600',
      bgLight: 'bg-blue-100',
    },
    governance: {
      bg: 'bg-orange-500',
      bgLight: 'bg-orange-100',
    },
    overall: {
      bg: 'bg-indigo-600',
      bgLight: 'bg-indigo-100',
    },
  };

  const colors = colorMap[type];

  return (
    <div className="w-full">
      <div className={`h-2 rounded-full ${colors.bgLight}`}>
        <div
          className={`h-2 rounded-full ${colors.bg}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

