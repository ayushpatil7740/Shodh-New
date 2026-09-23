import React, { useState } from 'react';
import { ShieldCheck, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { claimService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export const ClaimModal = ({ isOpen, onClose, item, onClaimSuccess }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    claimantName: user?.name || '',
    claimantPhone: user?.phone || '',
    claimantEmail: user?.email || '',
    proofDescription: '',
  });

  const [proofImage, setProofImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isLostItem = item?.type === 'lost';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      setProofImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('itemId', item._id);
      data.append('claimantName', formData.claimantName);
      data.append('claimantPhone', formData.claimantPhone);
      data.append('claimantEmail', formData.claimantEmail);
      data.append('proofDescription', formData.proofDescription);

      if (proofImage) {
        data.append('proofImage', proofImage);
      }

      const res = await claimService.createClaim(data);

      if (res.data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        setSuccessMsg(
          isLostItem
            ? 'Your response was submitted! The item owner has been notified.'
            : 'Claim submitted successfully! The person who found this item will review your proof.'
        );

        if (onClaimSuccess) {
          onClaimSuccess(res.data.claim);
        }

        setTimeout(() => {
          onClose();
          setSuccessMsg('');
        }, 2200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit claim. Please check your information.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLostItem ? 'I Found This Item' : 'Claim This Item'}
      maxWidth="max-w-xl"
    >
      {successMsg ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">Submission Received!</h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Informational Banner */}
          <div className="bg-brand-50 border border-brand-200/80 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-brand-900">
            <ShieldCheck className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-brand-800">
                {isLostItem
                  ? `Report matching found item for "${item?.title}"`
                  : `Claim ownership of "${item?.title}"`}
              </p>
              <p className="text-slate-600 mt-0.5">
                {isLostItem
                  ? 'Describe where and when you found it, or how the owner can safely contact you.'
                  : 'Please provide identifying characteristics (scratches, unique stickers, serial number, or answers to any secret question) to verify ownership.'}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Secret question prompt if owner set one */}
          {item?.secretQuestion && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
              <span className="font-bold">Verification Question from Poster: </span>
              <span>{item.secretQuestion}</span>
            </div>
          )}

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="claimantName"
                value={formData.claimantName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="claimantPhone"
                value={formData.claimantPhone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="claimantEmail"
              value={formData.claimantEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Proof Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proof of Ownership / Distinguishing Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="proofDescription"
              rows={3}
              value={formData.proofDescription}
              onChange={handleChange}
              required
              placeholder={
                isLostItem
                  ? 'Explain where you currently have the item stored or where the owner can meet you.'
                  : 'Describe specific marks, unique contents inside, serial number, background wallpaper, or purchase details.'
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Optional Proof Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Proof Document / Photo (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition">
                <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Proof Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition shadow-xs"
            >
              {loading ? 'Submitting...' : 'Submit Claim Request'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ClaimModal;
