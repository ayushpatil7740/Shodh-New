import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Eye,
  Gift,
  Shield,
  Share2,
  Edit2,
  Trash2,
  CheckCircle2,
  User,
  Phone,
  Mail,
  HelpCircle,
  Clock,
  Check,
  AlertCircle,
} from 'lucide-react';
import { itemService, claimService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, TypeBadge, CategoryBadge } from '../components/common/Badge';
import { formatDate, formatDateTime, resolveImageUrl, getCategoryGradient } from '../utils/formatters';
import ClaimModal from '../components/items/ClaimModal';
import ClaimsReceivedTable from '../components/dashboard/ClaimsReceivedTable';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [userClaim, setUserClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchItemData = async () => {
    try {
      setLoading(true);
      const res = await itemService.getItemById(id);
      if (res.data && res.data.success) {
        setItem(res.data.item);
        setClaims(res.data.claims || []);
        setUserClaim(res.data.userClaim || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [id]);

  const handleDeleteItem = async () => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) {
      return;
    }
    try {
      await itemService.deleteItem(id);
      navigate('/items');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await itemService.updateItem(id, { status: newStatus });
      if (res.data.success) {
        setItem(res.data.item);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleClaimStatusUpdate = async (claimId, status, notes) => {
    try {
      await claimService.updateClaimStatus(claimId, {
        status,
        adminOrOwnerNotes: notes,
      });
      fetchItemData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim status');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading listing information..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Item Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This listing may have been removed.'}</p>
        <Link
          to="/items"
          className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  const isOwner = user && item.postedBy && user.id === item.postedBy._id;
  const canManage = isOwner || isAdmin;
  const isLost = item.type === 'lost';
  const imageUrl = resolveImageUrl(item.imageUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link to="/items" className="hover:text-slate-800">Listings</Link>
          <span>/</span>
          <span className="capitalize">{item.type} Items</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-[200px]">{item.title}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>Share Listing</span>
              </>
            )}
          </button>

          {canManage && (
            <>
              <Link
                to={`/items/${item._id}/edit`}
                className="inline-flex items-center px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Link>
              <button
                onClick={handleDeleteItem}
                className="inline-flex items-center px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Image + Details + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Item Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-card min-h-[320px] sm:min-h-[400px] flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title}
                className="w-full max-h-[500px] object-contain"
              />
            ) : (
              <div
                className={`w-full h-80 sm:h-96 bg-gradient-to-br ${getCategoryGradient(
                  item.category
                )} flex flex-col items-center justify-center text-white p-8`}
              >
                <div className="p-4 bg-white/20 backdrop-blur-xs rounded-3xl mb-3 shadow-sm">
                  <Shield className="w-12 h-12 text-white/90" />
                </div>
                <h3 className="text-xl font-bold">{item.category}</h3>
                <p className="text-xs text-white/80 mt-1 uppercase tracking-wider">
                  No Photo Attached &bull; Safe Storage
                </p>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <TypeBadge type={item.type} size="lg" />
              <StatusBadge status={item.status} size="lg" />
            </div>

            {item.reward && (
              <div className="absolute bottom-4 left-4 bg-amber-500/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center shadow-md">
                <Gift className="w-4 h-4 mr-1.5" />
                <span>Reward Offered: {item.reward}</span>
              </div>
            )}
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <CategoryBadge category={item.category} />
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-500">
                  Reported {formatDate(item.createdAt)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.title}
              </h1>
            </div>

            {/* Meta tags list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100 text-xs">
              <div className="flex items-start space-x-2 text-slate-600">
                <MapPin className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900 block">Location / Landmark</span>
                  <span>{item.location?.placeName}</span>
                  {item.location?.landmark && (
                    <span className="text-slate-400 block mt-0.5">
                      Landmark: {item.location.landmark}
                    </span>
                  )}
                  {item.location?.city && (
                    <span className="text-slate-400 block">{item.location.city}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 text-slate-600">
                <Calendar className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {isLost ? 'Date Lost' : 'Date Found'}
                  </span>
                  <span>{formatDate(item.dateLostOrFound)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Description & Details</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            {/* Secret Question (if set) */}
            {item.secretQuestion && (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Verification Question Set by Poster:</span>
                </div>
                <p className="text-xs text-amber-800">{item.secretQuestion}</p>
                <p className="text-[11px] text-amber-600 italic">
                  Claimants will be asked to verify this detail when claiming.
                </p>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* If Owner viewing: Claims management table on this item */}
          {canManage && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Submitted Claims & Proofs ({claims.length})
                </h3>
              </div>
              <ClaimsReceivedTable
                claims={claims}
                onUpdateStatus={handleClaimStatusUpdate}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar: Poster Info, Actions, Safety Tips */}
        <div className="space-y-6">
          {/* Claim / Action Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Claim & Matching</h3>

            {/* Status overview */}
            {item.status !== 'active' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1 text-xs">
                <p className="font-bold flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Item Case Resolved / Handed Over
                </p>
                <p className="text-slate-600">
                  This item has already been claimed or safely returned to its owner.
                </p>
              </div>
            ) : userClaim ? (
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 space-y-1 text-xs">
                <p className="font-bold flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-brand-600" />
                  Claim Submitted (Status: {userClaim.status})
                </p>
                <p className="text-slate-600">
                  You have submitted a claim for this item on {formatDate(userClaim.createdAt)}. The poster will review your proof.
                </p>
              </div>
            ) : isOwner ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-2">
                <p className="font-semibold text-slate-900">You posted this listing</p>
                <p className="text-slate-500">
                  You can update its status or review received claims when people respond.
                </p>
                <div className="pt-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Quick Status Toggle
                  </label>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="active">Active</option>
                    <option value="claimed">Claimed</option>
                    <option value="resolved">Resolved</option>
                    <option value="handed_over">Handed Over</option>
                  </select>
                </div>
              </div>
            ) : isAuthenticated ? (
              <button
                onClick={() => setClaimModalOpen(true)}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md transition hover:-translate-y-0.5 ${
                  isLost
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'
                }`}
              >
                {isLost ? '🤝 I Found This Item' : '🔍 Claim This Item'}
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full block text-center py-3 rounded-2xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
                >
                  Log in to Claim or Contact
                </Link>
                <p className="text-[11px] text-center text-slate-400">
                  Authentication is required to protect user contact information.
                </p>
              </div>
            )}
          </div>

          {/* Poster Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reported By
            </h4>
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {item.postedBy?.name ? item.postedBy.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 text-sm truncate">
                  {item.contactName || item.postedBy?.name || 'Community Member'}
                </p>
                <p className="text-xs text-slate-400">
                  Member since {formatDate(item.postedBy?.createdAt)}
                </p>
              </div>
            </div>

            {/* Direct contact section (visible if allowed or admin) */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              {item.contactPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>{item.contactPhone}</span>
                </div>
              )}
              {item.contactEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-brand-600" />
                  <span>{item.contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Safety Reminder Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-subtle space-y-3">
            <div className="flex items-center space-x-2 text-brand-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>Campus Safety Reminder</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Always schedule handovers in public daytime campus zones like the Central Library Help Desk or Security Post.
            </p>
          </div>
        </div>
      </div>

      {/* Claim Submission Modal */}
      {claimModalOpen && (
        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          item={item}
          onClaimSuccess={(newClaim) => {
            setUserClaim(newClaim);
          }}
        />
      )}
    </div>
  );
};

export default ItemDetail;
