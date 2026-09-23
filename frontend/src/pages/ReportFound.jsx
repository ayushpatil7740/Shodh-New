import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  AlertCircle,
  HelpCircle,
  MapPin,
  Calendar,
  CheckCircle,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/constants';

export const ReportFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    type: 'found',
    placeName: '',
    city: 'Main Campus',
    landmark: '',
    dateLostOrFound: new Date().toISOString().split('T')[0],
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    secretQuestion: '',
    tags: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setImageFile(file);
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
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await itemService.createItem(data);
      if (res.data && res.data.success) {
        navigate(`/items/${res.data.item._id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit report. Please check the fields.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-subtle space-y-8">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide mb-2">
            Found Item Report
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Found Item
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Thank you for being an honest community member! List what you found to help the owner reclaim it safely.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px] text-slate-400">
              1. Item Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item Title / Headline <span className="text-emerald-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Apple AirPods Pro with Matte Blue Silicon Case"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-emerald-600">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date Found <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="date"
                  name="dateLostOrFound"
                  value={formData.dateLostOrFound}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Kept Location <span className="text-emerald-600">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe general item appearance, where it was spotted, and if you deposited it with campus reception or have it safely in person."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px] text-slate-400">
              2. Location Where Found
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Building / Area / Place Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  name="placeName"
                  value={formData.placeName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Food Court / Cafeteria"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Landmark / Table / Room
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Table #8 near Juice Bar"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Verification Question & Tags */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px] text-slate-400">
              3. Verification & Privacy
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secret Ownership Question (Recommended for high value items)
              </label>
              <input
                type="text"
                name="secretQuestion"
                value={formData.secretQuestion}
                onChange={handleChange}
                placeholder="e.g. What is the custom name engraved or wallpaper on the device?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Anyone claiming this item will be prompted to answer this before you confirm handover.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Search Tags / Keywords (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. earbuds, airpods, blue case, canteen"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Photo Upload */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px] text-slate-400">
              4. Photo of the Found Item (Optional)
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="cursor-pointer flex-1 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Click to browse and upload photo of found item
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Supports JPG, PNG, WEBP up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-xs shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              to="/items"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 disabled:opacity-50 transition"
            >
              {loading ? 'Submitting Report...' : 'Publish Found Item Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
