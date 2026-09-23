import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-600 mb-6 shadow-xs">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
        The page you are looking for may have been moved, deleted, or possibly lost on campus!
      </p>

      <div className="flex space-x-3">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
        >
          <Home className="w-4 h-4 mr-1.5" />
          Back to Home
        </Link>
        <Link
          to="/items"
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition"
        >
          <Search className="w-4 h-4 mr-1.5 text-slate-400" />
          Search Directory
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
