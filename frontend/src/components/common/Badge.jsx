import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm font-semibold' : 'px-2.5 py-0.5 text-xs font-medium';

  switch (status) {
    case 'active':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Active
        </span>
      );
    case 'claimed':
      return (
        <span className={`inline-flex items-center rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-purple-500"></span>
          Claimed
        </span>
      );
    case 'resolved':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
          Resolved
        </span>
      );
    case 'handed_over':
      return (
        <span className={`inline-flex items-center rounded-full bg-teal-50 text-teal-700 border border-teal-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-teal-500"></span>
          Handed Over
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};

export const TypeBadge = ({ type, size = 'sm' }) => {
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm font-bold' : 'px-2.5 py-0.5 text-xs font-semibold';

  if (type === 'lost') {
    return (
      <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide ${sizeClasses}`}>
        Lost
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide ${sizeClasses}`}>
      Found
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {category}
    </span>
  );
};
