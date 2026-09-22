import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ItemForm from '../components/ItemForm';
import MatchCard from '../components/MatchCard';
import { reportLostItem } from '../services/api';
import { AlertCircle, CheckCircle2, Sparkles, ArrowLeft, Plus } from 'lucide-react';

export default function ReportLostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await reportLostItem(formData);
      if (response && response.success) {
        setSuccessData(response);
      } else {
        setServerError(response.message || 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const errMsg =
        err.response?.data?.message ||
        'Network or server error while uploading. Please check your connection and try again.';
      setServerError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm text-center animate-fadeIn space-y-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Lost Item Logged
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Report Submitted Successfully!
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                Your report for <strong className="text-slate-900">{successData.data?.itemName}</strong> is now listed in the campus directory.
              </p>
            </div>

            {/* Possible Matches Section */}
            {successData.matches && successData.matches.length > 0 ? (
              <div className="text-left bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5 sm:p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      We Found {successData.matches.length} Potential Match{successData.matches.length > 1 ? 'es' : ''}!
                    </h3>
                    <p className="text-xs text-slate-500">
                      Found items in our database share similar attributes with your lost report:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {successData.matches.map((match) => (
                    <MatchCard key={match.item.id} match={match} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-500">
                <p>No immediate matching found items were detected right now.</p>
                <p className="text-xs mt-1 text-slate-400">
                  Don't worry! As soon as someone reports a found item matching your details, it will show up under Possible Matches on your item page.
                </p>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <Link
                to={`/item/${successData.data.id}`}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
              >
                View Your Item Details
              </Link>
              <button
                type="button"
                onClick={() => setSuccessData(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Report Another Item
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 mb-2">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                Lost Item Report
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Report a Lost Item
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Fill in the details below. Our smart match algorithm will instantly check whether anyone has already reported finding your item.
              </p>
            </div>

            <ItemForm
              type="lost"
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              serverError={serverError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
