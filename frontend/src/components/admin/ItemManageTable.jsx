import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, Edit } from 'lucide-react';
import { StatusBadge, TypeBadge, CategoryBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export const ItemManageTable = ({ items, onDeleteItem, onStatusChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Title & Location</th>
              <th className="px-5 py-3.5">Type & Category</th>
              <th className="px-5 py-3.5">Reported By</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/80 transition">
                <td className="px-5 py-4 font-medium text-slate-900 max-w-[220px]">
                  <Link
                    to={`/items/${item._id}`}
                    className="hover:text-brand-600 font-bold block truncate"
                  >
                    {item.title}
                  </Link>
                  <span className="text-[11px] text-slate-400 block truncate">
                    📍 {item.location?.placeName || 'Campus'}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <TypeBadge type={item.type} />
                    <CategoryBadge category={item.category} />
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-800 block">
                    {item.postedBy?.name || 'Unknown'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {item.postedBy?.email || ''}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-500">
                  {formatDate(item.dateLostOrFound)}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange(item._id, e.target.value)}
                    className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                  >
                    <option value="active">Active</option>
                    <option value="claimed">Claimed</option>
                    <option value="resolved">Resolved</option>
                    <option value="handed_over">Handed Over</option>
                  </select>
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <Link
                      to={`/items/${item._id}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/items/${item._id}/edit`}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDeleteItem(item._id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemManageTable;
