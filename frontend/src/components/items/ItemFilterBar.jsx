import React from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { CATEGORIES, ITEM_STATUSES } from '../../utils/constants';

export const ItemFilterBar = ({ filters, onFilterChange, onResetFilters }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
      {/* Top Row: Type Pills & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Type Toggle Tabs */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button
            type="button"
            onClick={() => onFilterChange('type', 'all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filters.type === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('type', 'lost')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filters.type === 'lost'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Lost Items
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('type', 'found')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filters.type === 'found'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Found Items
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by keyword, item name, or location..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Category, Status, Location & Sort Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 items-center">
        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          >
            <option value="all">All Statuses</option>
            {ITEM_STATUSES.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Text Field */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Library, Lab"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          >
            <option value="newest">Recently Reported</option>
            <option value="date">Date Lost / Found</option>
            <option value="views">Most Viewed</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex items-end">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center transition"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemFilterBar;
