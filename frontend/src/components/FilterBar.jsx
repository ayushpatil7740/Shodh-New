import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

export default function FilterBar({
  selectedType = 'all',
  onTypeChange,
  selectedCategory = 'all',
  onCategoryChange,
  locationQuery = '',
  onLocationChange,
  sortBy = 'newest',
  onSortChange,
  onReset
}) {
  const hasActiveFilters =
    selectedType !== 'all' ||
    selectedCategory !== 'all' ||
    Boolean(locationQuery.trim()) ||
    sortBy !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Type Filter Buttons (All, Lost, Found) */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onTypeChange('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              selectedType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('lost')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              selectedType === 'lost'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Lost Items
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('found')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              selectedType === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Found Items
          </button>
        </div>

        {/* Reset button if filters active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
        {/* Category dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location filter input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Location
          </label>
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="e.g. Library, Cafeteria, Lab..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>

        {/* Sort order */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
