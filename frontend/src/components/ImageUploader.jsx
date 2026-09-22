import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function ImageUploader({ onImageSelected, error: externalError }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const validateAndProcessFile = (file) => {
    setError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file format. Only JPG, JPEG, PNG, and WebP are allowed.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB. Please select a smaller photo.`);
      return;
    }

    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageSelected) {
      onImageSelected(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        Item Photo <span className="text-slate-400 font-normal">(Optional but recommended)</span>
      </label>

      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center group"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Click to upload or drag & drop photo
          </p>
          <p className="text-xs text-slate-500 mt-1">
            JPG, PNG, or WebP (Max 5MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-56 object-contain bg-slate-950/80"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition flex items-center space-x-1 px-3 text-xs font-semibold cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Remove Photo</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span className="truncate max-w-[200px] flex items-center">
              <ImageIcon className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              {fileName}
            </span>
            <span className="text-emerald-400 text-[11px] font-medium">Ready to upload</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {(error || externalError) && (
        <div className="mt-2 flex items-center text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span>{error || externalError}</span>
        </div>
      )}
    </div>
  );
}
