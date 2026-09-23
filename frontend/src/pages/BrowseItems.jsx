import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { itemService } from '../services/api';
import ItemCard from '../components/items/ItemCard';
import ItemFilterBar from '../components/items/ItemFilterBar';
import { LoadingSpinner, CardSkeleton } from '../components/common/LoadingSpinner';
import { ChevronLeft, ChevronRight, PackageSearch, PlusCircle } from 'lucide-react';

export const BrowseItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local filter states synced with searchParams
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    status: searchParams.get('status') || 'all',
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state changes to URL query
  const updateQueryAndState = (newFilters) => {
    setFilters(newFilters);
    const params = {};
    if (newFilters.type && newFilters.type !== 'all') params.type = newFilters.type;
    if (newFilters.category && newFilters.category !== 'all') params.category = newFilters.category;
    if (newFilters.status && newFilters.status !== 'all') params.status = newFilters.status;
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.location) params.location = newFilters.location;
    if (newFilters.sortBy && newFilters.sortBy !== 'newest') params.sortBy = newFilters.sortBy;
    if (newFilters.page > 1) params.page = String(newFilters.page);

    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    updateQueryAndState({
      ...filters,
      [key]: value,
      page: 1, // Reset to page 1 on filter change
    });
  };

  const handleResetFilters = () => {
    updateQueryAndState({
      type: 'all',
      category: 'all',
      status: 'all',
      search: '',
      location: '',
      sortBy: 'newest',
      page: 1,
    });
  };

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        type: filters.type,
        category: filters.category,
        status: filters.status,
        search: filters.search,
        location: filters.location,
        sortBy: filters.sortBy,
        page: filters.page,
        limit: 12,
      };

      const res = await itemService.getItems(params);
      if (res.data && res.data.success) {
        setItems(res.data.items || []);
        setTotalItems(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Lost & Found Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-semibold text-slate-800">{totalItems}</span> matching listings
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/report-lost"
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs border border-rose-200 shadow-xs flex items-center transition"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Report Lost
          </Link>
          <Link
            to="/report-found"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 shadow-xs flex items-center transition"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Report Found
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ItemFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Item Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-subtle space-y-4">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto text-brand-600">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No matching items found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any listings matching your search filters. Try broadening your keywords or resetting filters.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Reset All Filters
            </button>
            <Link
              to="/report-lost"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
            >
              Report an Item
            </Link>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6 border-t border-slate-200">
          <button
            onClick={() => updateQueryAndState({ ...filters, page: filters.page - 1 })}
            disabled={filters.page <= 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => updateQueryAndState({ ...filters, page: pageNum })}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                  filters.page === pageNum
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => updateQueryAndState({ ...filters, page: filters.page + 1 })}
            disabled={filters.page >= totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
