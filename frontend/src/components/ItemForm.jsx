import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import ImageUploader from './ImageUploader';
import { Send, AlertCircle, Sparkles } from 'lucide-react';

export default function ItemForm({
  type = 'lost', // 'lost' or 'found'
  onSubmit,
  isSubmitting = false,
  serverError = null
}) {
  const isLost = type === 'lost';

  // Today's date formatted as YYYY-MM-DD for default
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    location: '',
    date: todayString,
    time: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    additionalInfo: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field once user edits
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Please provide the name of the item.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the item (color, brand, distinguishing marks).';
    }

    if (!formData.location.trim()) {
      newErrors.location = isLost
        ? 'Please specify where you lost the item.'
        : 'Please specify where you found the item.';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required.';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = isLost
        ? 'Please enter your name.'
        : 'Please enter finder name.';
    }

    if (!formData.contactEmail.trim() && !formData.contactPhone.trim()) {
      newErrors.contact = 'Please enter at least an email address or phone number.';
    }

    if (formData.contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Build FormData for multipart upload
    const payload = new FormData();
    payload.append('itemName', formData.itemName.trim());
    payload.append('category', formData.category);
    payload.append('description', formData.description.trim());
    payload.append('location', formData.location.trim());
    payload.append('date', formData.date);
    payload.append('time', formData.time.trim());
    payload.append(isLost ? 'contactName' : 'finderName', formData.contactName.trim());
    payload.append('contactEmail', formData.contactEmail.trim());
    payload.append('contactPhone', formData.contactPhone.trim());
    payload.append('additionalInfo', formData.additionalInfo.trim());

    if (selectedFile) {
      payload.append('photo', selectedFile);
    }

    if (onSubmit) {
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Section 1: Item Details */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
          <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
          Item Information
        </h3>

        {/* Item Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder={isLost ? "e.g. Black Leather Wallet, iPhone 14, Blue Backpack" : "e.g. Keys with Honda Keychain, Brown Wallet"}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.itemName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
            } text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
          />
          {errors.itemName && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.itemName}</p>
          )}
        </div>

        {/* Category & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.category ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
              } text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.category}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isLost ? 'Location Lost' : 'Location Found'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={isLost ? "e.g. Central Library 2nd Floor" : "e.g. Campus Cafeteria Table 5"}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.location ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
              } text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isLost ? 'Date Lost' : 'Date Found'} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.date ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
              } text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.date}</p>
            )}
          </div>

          {/* Approximate Time */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Approximate Time <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="3"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe unique identifiers, color, brand, stickers, contents, scratches, or other distinguishing marks..."
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.description ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
            } text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Photo Upload with ImageUploader */}
        <ImageUploader onImageSelected={(file) => setSelectedFile(file)} />
      </div>

      {/* Section 2: Contact Information */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>
            Contact Details
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Privacy protection: Your contact information is never displayed publicly on search cards. It is only shown on the verified item details page so the finder/owner can contact you.
          </p>
        </div>

        {errors.contact && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
            {errors.contact}
          </div>
        )}

        {/* Contact Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            {isLost ? 'Your Name' : 'Finder Name / Department'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder={isLost ? "e.g. Alex Johnson" : "e.g. Campus Security / Sarah"}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.contactName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
            } text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
          />
          {errors.contactName && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.contactName}</p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-slate-400 font-normal">(Recommended)</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="e.g. student@college.edu"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.contactEmail ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
              } text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
            />
            {errors.contactEmail && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.contactEmail}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Additional Notes / Instructions <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows="2"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder={isLost ? "e.g. Cash is not important, please return the ID card!" : "e.g. Handed to security guard at Gate 1."}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-base transition duration-200 shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
            isLost
              ? 'bg-rose-600 hover:bg-rose-700 active:scale-[0.99] shadow-rose-200'
              : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-200'
          } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span>Uploading & Processing...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{isLost ? 'Report Lost Item' : 'Report Found Item'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
