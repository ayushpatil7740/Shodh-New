import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  message = 'Something went wrong. Please try again.',
  onRetry
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 my-4 shadow-xs">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center text-xs font-semibold text-red-700 hover:text-red-900 underline transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
