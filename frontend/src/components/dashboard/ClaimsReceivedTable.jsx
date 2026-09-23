import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Eye, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Modal from '../common/Modal';
import confetti from 'canvas-confetti';

export const ClaimsReceivedTable = ({ claims, onUpdateStatus }) => {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [claimToReject, setClaimToReject] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleApprove = async (claimId) => {
    if (!window.confirm('Are you sure you want to approve this claim? This will mark the item as claimed and share your contact details.')) {
      return;
    }
    setActionLoading(true);
    await onUpdateStatus(claimId, 'approved');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setActionLoading(false);
  };

  const openRejectModal = (claim) => {
    setClaimToReject(claim);
    setRejectNotes('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!claimToReject) return;
    setActionLoading(true);
    await onUpdateStatus(claimToReject._id, 'rejected', rejectNotes);
    setActionLoading(false);
    setRejectModalOpen(false);
    setClaimToReject(null);
  };

  if (!claims || claims.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
        <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-700">No claims received yet</p>
        <p className="mt-1">When someone claims or reports a match for an item you posted, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item Listing</th>
                <th className="px-5 py-3.5">Claimant Details</th>
                <th className="px-5 py-3.5">Proof Description</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((claim) => (
                <tr key={claim._id} className="hover:bg-slate-50/80 transition">
                  {/* Item info */}
                  <td className="px-5 py-4 font-medium text-slate-900 max-w-[200px]">
                    <Link
                      to={`/items/${claim.item?._id}`}
                      className="hover:text-brand-600 font-bold block truncate"
                    >
                      {claim.item?.title || 'Item listing'}
                    </Link>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Submitted {formatDate(claim.createdAt)}
                    </span>
                  </td>

                  {/* Claimant info */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 flex items-center">
                        <User className="w-3 h-3 mr-1 text-slate-400" />
                        {claim.claimantName}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" />
                        {claim.claimantPhone}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-slate-400" />
                        {claim.claimantEmail}
                      </p>
                    </div>
                  </td>

                  {/* Proof */}
                  <td className="px-5 py-4 max-w-xs">
                    <p className="line-clamp-2 text-slate-700">{claim.proofDescription}</p>
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 mt-1 inline-flex items-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Full Proof {claim.proofImageUrl && '(Photo Attached)'}
                    </button>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4">
                    {claim.status === 'pending' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Review
                      </span>
                    )}
                    {claim.status === 'approved' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Approved & Verified
                      </span>
                    )}
                    {claim.status === 'rejected' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    {claim.status === 'pending' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(claim._id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center shadow-xs transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(claim)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs flex items-center border border-rose-200 transition"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Viewer Modal */}
      {selectedClaim && (
        <Modal
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          title="Review Submitted Claim & Proof"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-800 text-sm">{selectedClaim.item?.title}</h5>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <p><span className="font-semibold text-slate-800">Claimant:</span> {selectedClaim.claimantName}</p>
                <p><span className="font-semibold text-slate-800">Phone:</span> {selectedClaim.claimantPhone}</p>
                <p className="col-span-2"><span className="font-semibold text-slate-800">Email:</span> {selectedClaim.claimantEmail}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">Provided Identification Proof / Description:</p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedClaim.proofDescription}
              </div>
            </div>

            {selectedClaim.proofImageUrl && (
              <div>
                <p className="font-bold text-slate-800 mb-1">Attached Proof Document / Photo:</p>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={selectedClaim.proofImageUrl}
                    alt="Proof Attachment"
                    className="w-full max-h-64 object-contain bg-slate-100"
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal with optional notes */}
      {rejectModalOpen && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Claim Request"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Provide a brief explanation why this claim was not approved (e.g. "Provided details did not match the item markings"):
            </p>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={3}
              placeholder="Reason for rejection (optional)..."
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClaimsReceivedTable;
