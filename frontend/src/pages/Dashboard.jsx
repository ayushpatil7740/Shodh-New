import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  UserCheck,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { itemService, claimService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MyReportsList from '../components/dashboard/MyReportsList';
import ClaimsReceivedTable from '../components/dashboard/ClaimsReceivedTable';
import MyClaimsTable from '../components/dashboard/MyClaimsTable';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'received_claims' | 'my_claims'

  const [myItems, setMyItems] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [sentClaims, setSentClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsRes, receivedRes, sentRes] = await Promise.all([
        itemService.getMyItems(),
        claimService.getMyReceivedClaims(),
        claimService.getMySentClaims(),
      ]);

      if (itemsRes.data && itemsRes.data.success) {
        setMyItems(itemsRes.data.items || []);
      }
      if (receivedRes.data && receivedRes.data.success) {
        setReceivedClaims(receivedRes.data.claims || []);
      }
      if (sentRes.data && sentRes.data.success) {
        setSentClaims(sentRes.data.claims || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await itemService.deleteItem(id);
      setMyItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await itemService.updateItem(id, { status });
      if (res.data.success) {
        setMyItems((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status } : item))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleClaimStatusUpdate = async (claimId, status, notes) => {
    try {
      await claimService.updateClaimStatus(claimId, {
        status,
        adminOrOwnerNotes: notes,
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim status');
    }
  };

  const handleCancelSentClaim = async (claimId) => {
    if (!window.confirm('Are you sure you want to cancel this claim request?')) return;
    try {
      await claimService.deleteClaim(claimId);
      setSentClaims((prev) => prev.filter((c) => c._id !== claimId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel claim');
    }
  };

  const pendingReceivedCount = receivedClaims.filter((c) => c.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/30 text-brand-300 border border-brand-400/30">
              Personal Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Friend'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage your reported lost and found belongings and track pending claims.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/report-lost"
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            + Report Lost
          </Link>
          <Link
            to="/report-found"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            + Report Found
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500">My Listings</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{myItems.length}</p>
          <span className="text-[10px] text-slate-400">Total posted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500">Claims Received</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">{receivedClaims.length}</p>
          <span className="text-[10px] text-amber-600 font-semibold">
            {pendingReceivedCount} pending review
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500">Claims I Submitted</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{sentClaims.length}</p>
          <span className="text-[10px] text-slate-400">On other listings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500">Resolved Cases</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {myItems.filter((i) => ['claimed', 'resolved', 'handed_over'].includes(i.status)).length}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Completed</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'reports'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Reported Items ({myItems.length})
        </button>

        <button
          onClick={() => setActiveTab('received_claims')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 flex items-center ${
            activeTab === 'received_claims'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Claims Received ({receivedClaims.length})</span>
          {pendingReceivedCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
              {pendingReceivedCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_claims')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'my_claims'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Submitted Claims ({sentClaims.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingSpinner text="Fetching dashboard details..." />
      ) : activeTab === 'reports' ? (
        <MyReportsList
          items={myItems}
          onDelete={handleDeleteItem}
          onStatusChange={handleStatusChange}
        />
      ) : activeTab === 'received_claims' ? (
        <ClaimsReceivedTable
          claims={receivedClaims}
          onUpdateStatus={handleClaimStatusUpdate}
        />
      ) : (
        <MyClaimsTable
          claims={sentClaims}
          onCancelClaim={handleCancelSentClaim}
        />
      )}
    </div>
  );
};

export default Dashboard;
