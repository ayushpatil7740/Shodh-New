import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem, updateItem, login } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  ShieldCheck,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('auth_token'));
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const DEMO_PASSCODE = 'admin123';

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await login({ passcode: passcode.trim(), password: passcode.trim() });
      if (res && res.success) {
        setIsAuthenticated(true);
        if (res.token) localStorage.setItem('auth_token', res.token);
      } else {
        setAuthError(res.message || `Invalid passcode. For demo evaluation, use "${DEMO_PASSCODE}"`);
      }
    } catch (err) {
      if (passcode.trim() === DEMO_PASSCODE) {
        setIsAuthenticated(true);
      } else {
        setAuthError(err.response?.data?.message || `Invalid passcode. For demo evaluation, use "${DEMO_PASSCODE}"`);
      }
    }
  };

  const handleQuickDemoLogin = async () => {
    setPasscode(DEMO_PASSCODE);
    setAuthError('');
    try {
      const res = await login({ passcode: DEMO_PASSCODE, password: DEMO_PASSCODE });
      if (res && res.success && res.token) {
        localStorage.setItem('auth_token', res.token);
      }
    } catch (_) {}
    setIsAuthenticated(true);
  };

  const fetchAllItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getItems();
      if (response && response.data) {
        setItems(response.data);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
      setError('Could not fetch items from backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllItems();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setItemToDelete(null);
      setActionSuccess('Item removed from records successfully.');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchAllItems();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const nextStatus = item.status === 'resolved' ? 'active' : 'resolved';
      await updateItem(item.id, { status: nextStatus });
      setActionSuccess(`Status updated to ${nextStatus}.`);
      setTimeout(() => setActionSuccess(''), 3000);
      fetchAllItems();
    } catch (err) {
      console.error('Update status error:', err);
      setError('Failed to update item status.');
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      !searchQuery.trim() ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.contactName && item.contactName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">Admin Demonstration Portal</h2>
          <p className="mt-1 text-xs text-slate-500">
            Intended for project evaluation. Enter demo passcode to manage reports.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter demo passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
            >
              Sign In as Admin
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center space-x-1"
            >
              <Unlock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span>One-Click Demo Access ({DEMO_PASSCODE})</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Statistics
  const totalReports = items.length;
  const lostCount = items.filter((i) => i.type === 'lost').length;
  const foundCount = items.filter((i) => i.type === 'found').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;

  return (
    <div className="min-h-screen py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Demo Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Admin Management Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Review, filter, verify, or remove reports from items.json storage.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={fetchAllItems}
              className="inline-flex items-center space-x-1 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 text-xs font-semibold rounded-xl transition shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('auth_token');
                setIsAuthenticated(false);
              }}
              className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-100 transition cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Notifications */}
        {actionSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center animate-fadeIn">
            <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
            {actionSuccess}
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={fetchAllItems} />}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <p className="text-2xl font-black text-slate-900">{totalReports}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Total Reports</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <p className="text-2xl font-black text-rose-600">{lostCount}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Lost Items</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <p className="text-2xl font-black text-emerald-600">{foundCount}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Found Items</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <p className="text-2xl font-black text-blue-600">{resolvedCount}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Reunited / Closed</p>
          </div>
        </div>

        {/* Controls: Filter tabs & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalReports})
            </button>
            <button
              onClick={() => setFilterType('lost')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'lost'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Lost ({lostCount})
            </button>
            <button
              onClick={() => setFilterType('found')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Found ({foundCount})
            </button>
          </div>

          {/* Quick Search inside admin */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports or submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Items Table */}
        {isLoading ? (
          <LoadingSpinner message="Refreshing admin list..." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Location & Date</th>
                    <th className="px-4 py-3">Submitter Contact</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                        No reports matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        {/* Item Photo & Title */}
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">
                                {item.itemName}
                              </p>
                              <p className="text-[11px] text-slate-400">ID: {item.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              item.type === 'lost'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          {item.category}
                        </td>

                        {/* Location & Date */}
                        <td className="px-4 py-3 text-slate-600">
                          <p className="font-medium text-slate-800 truncate max-w-[150px]">
                            {item.location}
                          </p>
                          <p className="text-[11px] text-slate-400">{item.date}</p>
                        </td>

                        {/* Submitter */}
                        <td className="px-4 py-3 text-slate-600">
                          <p className="font-medium text-slate-800">{item.contactName}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {item.contactEmail || item.contactPhone}
                          </p>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                              item.status === 'resolved'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {item.status === 'resolved' ? 'Reunited' : 'Active'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/item/${item.id}`}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                              title="View Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {itemToDelete && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Delete Report?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-slate-800">"{itemToDelete.itemName}"</strong>? This will remove it from <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">items.json</code>.
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(itemToDelete.id)}
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
