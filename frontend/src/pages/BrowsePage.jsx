import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ItemGrid from '../components/ItemGrid';
import ErrorMessage from '../components/ErrorMessage';
import { getItems, searchItems } from '../services/api';
import { Compass, SlidersHorizontal } from 'lucide-react';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const querySearch = searchParams.get('search') || '';
  const queryType = searchParams.get('type') || 'all';
  const queryCategory = searchParams.get('category') || 'all';
  const queryLocation = searchParams.get('location') || '';
  const querySort = searchParams.get('sort') || 'newest';

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with URL params
  const updateUrlParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data = [];
      if (querySearch.trim()) {
        const res = await searchItems(querySearch.trim());
        data = res.data || [];
      } else {
        const res = await getItems({
          type: queryType,
          category: queryCategory,
          location: queryLocation,
          sort: querySort
        });
        data = res.data || [];
      }

      // If search query was used, apply client-side filters on search results too
      if (querySearch.trim()) {
        if (queryType !== 'all') {
          data = data.filter((item) => item.type === queryType);
        }
        if (queryCategory !== 'all') {
          data = data.filter(
            (item) => item.category.toLowerCase() === queryCategory.toLowerCase()
          );
        }
        if (queryLocation.trim()) {
          const loc = queryLocation.toLowerCase();
          data = data.filter(
            (item) => item.location && item.location.toLowerCase().includes(loc)
          );
        }
        if (querySort === 'oldest') {
          data.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
        } else {
          data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        }
      }

      setItems(data);
    } catch (err) {
      console.error('Error fetching browse items:', err);
      setError('Failed to load items. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [querySearch, queryType, queryCategory, queryLocation, querySort]);

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Campus Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Browse Lost & Found Items
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Filter by category, search by keywords, or check lost and found status.
            </p>
          </div>

          <div className="text-xs sm:text-sm font-semibold text-slate-500">
            Showing <span className="text-indigo-600 font-bold">{items.length}</span> item{items.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          initialValue={querySearch}
          onSearch={(val) => updateUrlParam('search', val)}
          placeholder="Search items by name, description, location, or keywords..."
        />

        {/* Filter Bar */}
        <FilterBar
          selectedType={queryType}
          onTypeChange={(val) => updateUrlParam('type', val)}
          selectedCategory={queryCategory}
          onCategoryChange={(val) => updateUrlParam('category', val)}
          locationQuery={queryLocation}
          onLocationChange={(val) => updateUrlParam('location', val)}
          sortBy={querySort}
          onSortChange={(val) => updateUrlParam('sort', val)}
          onReset={handleResetFilters}
        />

        {/* Error Notification */}
        {error && <ErrorMessage message={error} onRetry={fetchData} />}

        {/* Items Grid */}
        <ItemGrid
          items={items}
          isLoading={isLoading}
          emptyTitle="No matching items found"
          emptyDescription="We couldn't find any lost or found items matching your current filters. Try changing your search keywords or resetting filters."
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
