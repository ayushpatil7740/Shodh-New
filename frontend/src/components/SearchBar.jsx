import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = 'Search by item name, keyword, category, or location...',
  className = ''
}) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full ${className}`}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3.5 bg-white text-slate-800 placeholder-slate-400 text-sm md:text-base rounded-2xl border border-slate-200/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-20 flex items-center pr-2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs flex items-center justify-center cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
}
