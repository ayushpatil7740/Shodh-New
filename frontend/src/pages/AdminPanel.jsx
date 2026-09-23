import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Package, Users, FileText, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { adminService, itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminStatWidgets from '../components/admin/AdminStatWidgets';
import ItemManageTable from '../components/admin/ItemManageTable';
import UserManageTable from '../components/admin/UserManageTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/formatters';

export const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'users' | 'claims'

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, itemsRes, usersRes, claimsRes] = await Promise.all([
        adminService.getStats(),
        itemService.getItems({ limit: 100 }),
        adminService.getUsers(),
        adminService.getClaims(),
      ]);

      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data);
      }
      if (itemsRes.data && itemsRes.data.success) {
        setItems(itemsRes.data.items || []);
      }
      if (usersRes.data && usersRes.data.success) {
        setUsers(usersRes.data.users || []);
      }
      if (claimsRes.data && claimsRes.data.success) {
        setClaims(claimsRes.data.claims || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin panel data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Admin confirmation: Delete this item and all attached claims permanently?')) {
      return;
    }
    try {
      await itemService.deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await itemService.updateItem(id, { status });
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.data && res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading Administrative Control Center..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/30 flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Administrative Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Administration & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor reported belongings, resolve claims disputes, and manage user accounts across the platform.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Stats
        </button>
      </div>

      {/* Stats Widgets */}
      {stats && <AdminStatWidgets analytics={stats.analytics} />}

      {/* Category Breakdown Card */}
      {stats?.categoryStats && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Reports by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {stats.categoryStats.map((cat) => (
              <div
                key={cat.category}
                className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 text-center"
              >
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{cat.category}</p>
                <p className="text-lg font-black text-brand-600 mt-1">{cat.total}</p>
                <div className="text-[10px] text-slate-400 mt-0.5 space-x-1">
                  <span className="text-rose-600 font-semibold">{cat.lost}L</span>
                  <span>/</span>
                  <span className="text-emerald-600 font-semibold">{cat.found}F</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('items')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'items'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Listings Directory ({items.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          User Accounts & Roles ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'claims'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Platform Claims & Disputes ({claims.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'items' ? (
        <ItemManageTable
          items={items}
          onDeleteItem={handleDeleteItem}
          onStatusChange={handleStatusChange}
        />
      ) : activeTab === 'users' ? (
        <UserManageTable
          users={users}
          onRoleChange={handleRoleChange}
          currentUserId={user?.id}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Item Listing</th>
                  <th className="px-5 py-3.5">Claimant</th>
                  <th className="px-5 py-3.5">Proof Description</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date Filed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-bold text-slate-900 max-w-[200px] truncate">
                      {claim.item?.title || 'Unknown Item'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800 block">{claim.claimantName}</span>
                      <span className="text-[10px] text-slate-400">{claim.claimantEmail}</span>
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate text-slate-700">
                      {claim.proofDescription}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          claim.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : claim.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(claim.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
