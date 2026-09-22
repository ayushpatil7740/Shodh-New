import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/api';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Info,
  CheckCircle,
  Share2
} from 'lucide-react';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getItemById(id);
      if (response && response.data) {
        setItem(response.data);
        setMatches(response.matches || []);
      } else {
        setError('Item could not be found.');
      }
    } catch (err) {
      console.error('Failed to load item:', err);
      setError('Item not found or server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    setShowContact(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 bg-slate-50 flex items-center justify-center">
        <LoadingSpinner message="Loading item details..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen py-16 bg-slate-50">
        <div className="max-w-xl mx-auto px-4 text-center">
          <ErrorMessage message={error || 'Item not found'} onRetry={fetchDetails} />
          <Link
            to="/browse"
            className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Browse Items
          </Link>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  // Format posted date
  const postedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : item.date;

  return (
    <div className="min-h-screen py-10 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Item'}</span>
          </button>
        </div>

        {/* Main Item Card Layout */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Column: Large Image */}
          <div className="md:col-span-6 bg-slate-900 relative min-h-[320px] md:min-h-[460px] flex items-center justify-center overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-full h-full object-contain max-h-[500px]"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&auto=format&fit=crop&q=80';
              }}
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                  isLost
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isLost ? 'Lost Item' : 'Found Item'}
              </span>

              {isResolved && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center shadow-md">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Reunited
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4">
              <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {item.category}
              </span>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400">
                  Posted on {postedDate}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {item.itemName}
                </h1>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Description
                </h4>
                <p className="mt-1.5 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center text-slate-700">
                  <MapPin className="w-4 h-4 mr-2.5 text-indigo-500 shrink-0" />
                  <span>
                    <strong className="font-semibold text-slate-900">Location: </strong>
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center text-slate-700">
                  <Calendar className="w-4 h-4 mr-2.5 text-indigo-500 shrink-0" />
                  <span>
                    <strong className="font-semibold text-slate-900">
                      {isLost ? 'Date Lost: ' : 'Date Found: '}
                    </strong>
                    {item.date}
                  </span>
                </div>

                {item.time && (
                  <div className="flex items-center text-slate-700">
                    <Clock className="w-4 h-4 mr-2.5 text-indigo-500 shrink-0" />
                    <span>
                      <strong className="font-semibold text-slate-900">Approx. Time: </strong>
                      {item.time}
                    </span>
                  </div>
                )}
              </div>

              {/* Additional notes if present */}
              {item.additionalInfo && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-amber-900">
                  <div className="flex items-center font-bold text-amber-800 mb-1">
                    <Info className="w-4 h-4 mr-1.5 shrink-0" />
                    Additional Information
                  </div>
                  <p>{item.additionalInfo}</p>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="pt-4 border-t border-slate-100">
              {!showContact ? (
                <button
                  type="button"
                  onClick={() => setShowContact(true)}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Contact {isLost ? 'Owner' : 'Finder'}</span>
                </button>
              ) : (
                <div className="bg-indigo-50/60 rounded-2xl border border-indigo-100 p-5 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center">
                      <User className="w-4 h-4 mr-1.5 text-indigo-600" />
                      Contact Information
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <p>
                      <strong className="text-slate-900">Name:</strong> {item.contactName}
                    </p>
                    {item.contactEmail && (
                      <p className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        <a
                          href={`mailto:${item.contactEmail}?subject=Regarding%20Lost%20and%20Found:%20${encodeURIComponent(item.itemName)}`}
                          className="text-indigo-600 hover:underline font-medium"
                        >
                          {item.contactEmail}
                        </a>
                      </p>
                    )}
                    {item.contactPhone && (
                      <p className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        <a
                          href={`tel:${item.contactPhone}`}
                          className="text-indigo-600 hover:underline font-medium"
                        >
                          {item.contactPhone}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Safety note */}
                  <div className="flex items-start space-x-2 text-[11px] text-slate-500 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Safety tip: Arrange exchanges in public campus locations (e.g. Student Helpdesk, Library, or Security Station).
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Possible Matches Section */}
        <section className="mt-12 pt-8 border-t border-slate-200 space-y-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Possible Matches
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Potential matches found in the opposite category based on category, title, location, and dates.
              </p>
            </div>
          </div>

          {matches && matches.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {matches.map((match) => (
                <MatchCard key={match.item.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <p className="text-sm font-medium">No algorithmic matches found for this item yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                When new reports with matching category, title, or location are submitted, they will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
