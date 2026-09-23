import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Phone, Mail, User, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const MyClaimsTable = ({ claims, onCancelClaim }) => {
  if (!claims || claims.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
        <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-700">No claims submitted yet</p>
        <p className="mt-1">When you claim a found item or report finding someone's lost item, you can track the status here.</p>
        <Link
          to="/items"
          className="inline-block mt-4 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl font-semibold hover:bg-brand-100 transition"
        >
          Browse Open Items
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Item Listing</th>
              <th className="px-5 py-3.5">Your Proof Details</th>
              <th className="px-5 py-3.5">Claim Status</th>
              <th className="px-5 py-3.5">Poster Contact / Response</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {claims.map((claim) => (
              <tr key={claim._id} className="hover:bg-slate-50/80 transition">
                {/* Item Info */}
                <td className="px-5 py-4 font-medium text-slate-900 max-w-[200px]">
                  <Link
                    to={`/items/${claim.item?._id}`}
                    className="hover:text-brand-600 font-bold block truncate"
                  >
                    {claim.item?.title || 'Item listing'}
                  </Link>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Filed {formatDate(claim.createdAt)}
                  </span>
                </td>

                {/* Proof preview */}
                <td className="px-5 py-4 max-w-xs">
                  <p className="line-clamp-2 text-slate-700">{claim.proofDescription}</p>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  {claim.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </span>
                  )}
                  {claim.status === 'approved' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </span>
                  )}
                  {claim.status === 'rejected' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <XCircle className="w-3 h-3 mr-1" />
                      Rejected
                    </span>
                  )}
                </td>

                {/* Contact revealed upon approval */}
                <td className="px-5 py-4">
                  {claim.status === 'approved' ? (
                    <div className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-xl space-y-1 text-emerald-900">
                      <p className="font-bold flex items-center">
                        <User className="w-3 h-3 mr-1 text-emerald-600" />
                        {claim.item?.contactName || claim.item?.postedBy?.name || 'Item Poster'}
                      </p>
                      {(claim.item?.contactPhone || claim.item?.postedBy?.phone) && (
                        <p className="text-[11px] flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-emerald-600" />
                          {claim.item?.contactPhone || claim.item?.postedBy?.phone}
                        </p>
                      )}
                      {(claim.item?.contactEmail || claim.item?.postedBy?.email) && (
                        <p className="text-[11px] flex items-center">
                          <Mail className="w-3 h-3 mr-1 text-emerald-600" />
                          {claim.item?.contactEmail || claim.item?.postedBy?.email}
                        </p>
                      )}
                    </div>
                  ) : claim.status === 'rejected' ? (
                    <span className="text-slate-500 italic text-[11px]">
                      {claim.adminOrOwnerNotes || 'Claim was reviewed and declined.'}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">
                      Contact info revealed once approved
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  {claim.status === 'pending' && (
                    <button
                      onClick={() => onCancelClaim(claim._id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
                      title="Cancel Claim"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClaimsTable;
