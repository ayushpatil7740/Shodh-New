import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { AlertCircle, PlusCircle, Sparkles, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export default function Hero({ stats = { total: 0, lost: 0, found: 0 } }) {
  const navigate = useNavigate();

  const handleHeroSearch = (query) => {
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Background subtle decorative blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Project Tag Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-xs text-xs font-semibold text-indigo-700 mb-6 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Intelligent Campus Lost & Found System</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Lost something? <br className="hidden sm:inline" />
          Found something? <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
            Help reunite it with its owner.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Report missing belongings or turn in items you found on campus. Our automated matching engine connects lost and found reports in real time.
        </p>

        {/* Action Buttons: "I Lost Something" & "I Found Something" */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Link
            to="/report-lost"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            <span>I Lost Something</span>
          </Link>

          <Link
            to="/report-found"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>I Found Something</span>
          </Link>
        </div>

        {/* Quick Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleHeroSearch}
            placeholder="Quick search: e.g. 'iPhone', 'Leather wallet', 'ID Card'..."
          />
        </div>

        {/* Quick Stats Banner */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total || 0}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Total Reports</p>
          </div>
          <div className="text-center border-x border-slate-200">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600">{stats.lost || 0}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Lost Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stats.found || 0}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Found Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}
