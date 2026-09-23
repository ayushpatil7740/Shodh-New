import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink, MessageSquare, AlertCircle } from 'lucide-react';
import { StatusBadge, TypeBadge, CategoryBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export const MyReportsList = ({ items, onDelete, onStatusChange }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No Reports Posted Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Have you lost something or found a misplaced item? Report it now to help the community.
        </p>
        <div className="mt-4 flex justify-center space-x-3">
          <Link
            to="/report-lost"
            className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-100 transition"
          >
            Report Lost
          </Link>
          <Link
            to="/report-found"
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition"
          >
            Report Found
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-subtle hover:shadow-card transition flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          {/* Left: Item Info */}
          <div className="flex items-start space-x-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <TypeBadge type={item.type} />
                <StatusBadge status={item.status} />
                <CategoryBadge category={item.category} />
                {item.pendingClaimsCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {item.pendingClaimsCount} Pending Claim{item.pendingClaimsCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <Link
                to={`/items/${item._id}`}
                className="text-sm font-bold text-slate-900 hover:text-brand-600 transition block truncate"
              >
                {item.title}
              </Link>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>📍 {item.location?.placeName || 'Campus'}</span>
                <span>📅 {formatDate(item.dateLostOrFound)}</span>
                <span>👁️ {item.viewsCount || 0} views</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            {/* Quick Status Toggle */}
            <select
              value={item.status}
              onChange={(e) => onStatusChange(item._id, e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-500/20 text-slate-700"
            >
              <option value="active">Active</option>
              <option value="claimed">Claimed</option>
              <option value="resolved">Resolved</option>
              <option value="handed_over">Handed Over</option>
            </select>

            <Link
              to={`/items/${item._id}`}
              title="View Listing Details"
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <Link
              to={`/items/${item._id}/edit`}
              title="Edit Report"
              className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <Edit2 className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onDelete(item._id)}
              title="Delete Report"
              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyReportsList;
