import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 ring-8 ring-slate-50">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition shadow-xs cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
