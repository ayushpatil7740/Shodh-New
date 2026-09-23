import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  AlertCircle,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, ITEM_STATUSES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    type: 'lost',
    placeName: '',
    city: '',
    landmark: '',
    dateLostOrFound: '',
    status: 'active',
    reward: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    secretQuestion: '',
    tags: '',
  });

  const [existingImage, setExistingImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await itemService.getItemById(id);
        if (res.data && res.data.success) {
          const itm = res.data.item;
          setFormData({
            title: itm.title || '',
            description: itm.description || '',
            category: itm.category || 'Electronics',
            type: itm.type || 'lost',
            placeName: itm.location?.placeName || '',
            city: itm.location?.city || '',
            landmark: itm.location?.landmark || '',
            dateLostOrFound: itm.dateLostOrFound
              ? new Date(itm.dateLostOrFound).toISOString().split('T')[0]
              : '',
            status: itm.status || 'active',
            reward: itm.reward || '',
            contactName: itm.contactName || '',
            contactPhone: itm.contactPhone || '',
            contactEmail: itm.contactEmail || '',
            secretQuestion: itm.secretQuestion || '',
            tags: itm.tags ? itm.tags.join(', ') : '',
          });
          setExistingImage(itm.imageUrl || '');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch item data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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

      const res = await itemService.updateItem(id, data);
      if (res.data && res.data.success) {
        navigate(`/items/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading item details..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-subtle space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <Link
              to={`/items/${id}`}
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Item
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Item Listing
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Status</span>
            <div className="mt-1">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
              >
                {ITEM_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
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
                  Date Lost/Found
                </label>
                <input
                  type="date"
                  name="dateLostOrFound"
                  value={formData.dateLostOrFound}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Place Name / Building
                </label>
                <input
                  type="text"
                  name="placeName"
                  value={formData.placeName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reward</label>
                <input
                  type="text"
                  name="reward"
                  value={formData.reward}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secret Verification Question
                </label>
                <input
                  type="text"
                  name="secretQuestion"
                  value={formData.secretQuestion}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200"
              />
            </div>

            {/* Replace Image */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Update Image (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition">
                  <Upload className="w-4 h-4 mr-2 text-slate-500" />
                  <span>Choose New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {(imagePreview || existingImage) && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={imagePreview || existingImage}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
            <Link
              to={`/items/${id}`}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-xs disabled:opacity-50 transition flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
